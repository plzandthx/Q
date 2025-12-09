/**
 * Organization Service
 * Handles organization and membership management
 */

import { prisma } from '../lib/prisma.js';
import {
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { generateToken } from '../lib/crypto.js';
import { sendInvitationEmail } from './email.service.js';
import { checkUserLimit } from './plan.service.js';
import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
  InviteMemberInput,
  UpdateMemberRoleInput,
} from '../schemas/organization.schema.js';
import { OrgRole, InvitationStatus } from '@prisma/client';

export interface OrganizationWithMembership {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  currentUserRole: OrgRole;
}

export interface MemberInfo {
  id: string;
  userId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: OrgRole;
  joinedAt: Date;
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Check if user has permission for role-based action
 */
function hasPermission(userRole: OrgRole, requiredRole: OrgRole): boolean {
  const roleHierarchy: Record<OrgRole, number> = {
    VIEWER: 0,
    MEMBER: 1,
    ADMIN: 2,
    OWNER: 3,
  };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Get user's organizations
 */
export async function getUserOrganizations(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ organizations: OrganizationWithMembership[]; total: number }> {
  const [memberships, total] = await Promise.all([
    prisma.orgMembership.findMany({
      where: { userId },
      include: {
        organization: {
          include: {
            _count: {
              select: { memberships: true },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.orgMembership.count({ where: { userId } }),
  ]);

  const organizations = memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    logoUrl: m.organization.logoUrl,
    createdAt: m.organization.createdAt,
    updatedAt: m.organization.updatedAt,
    memberCount: m.organization._count.memberships,
    currentUserRole: m.role,
  }));

  return { organizations, total };
}

/**
 * Get organization by ID with membership check
 */
export async function getOrganization(
  orgId: string,
  userId: string
): Promise<OrganizationWithMembership> {
  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
    include: {
      organization: {
        include: {
          _count: {
            select: { memberships: true },
          },
        },
      },
    },
  });

  if (!membership) {
    throw new NotFoundError('Organization');
  }

  return {
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    logoUrl: membership.organization.logoUrl,
    createdAt: membership.organization.createdAt,
    updatedAt: membership.organization.updatedAt,
    memberCount: membership.organization._count.memberships,
    currentUserRole: membership.role,
  };
}

/**
 * Get organization by slug
 */
export async function getOrganizationBySlug(
  slug: string,
  userId: string
): Promise<OrganizationWithMembership> {
  const org = await prisma.organization.findUnique({
    where: { slug, deletedAt: null },
    include: {
      _count: {
        select: { memberships: true },
      },
    },
  });

  if (!org) {
    throw new NotFoundError('Organization');
  }

  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId,
      },
    },
  });

  if (!membership) {
    throw new NotFoundError('Organization');
  }

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    logoUrl: org.logoUrl,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    memberCount: org._count.memberships,
    currentUserRole: membership.role,
  };
}

/**
 * Create a new organization
 */
export async function createOrganization(
  userId: string,
  input: CreateOrganizationInput
): Promise<OrganizationWithMembership> {
  // Generate or validate slug
  let slug = input.slug ?? generateSlug(input.name);

  // Check slug uniqueness
  const existing = await prisma.organization.findUnique({
    where: { slug },
  });

  if (existing) {
    if (input.slug) {
      throw new ConflictError('Organization slug already exists');
    }
    // Auto-generate unique slug
    let counter = 1;
    while (await prisma.organization.findUnique({ where: { slug: `${slug}-${counter}` } })) {
      counter++;
    }
    slug = `${slug}-${counter}`;
  }

  const org = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: input.name,
        slug,
      },
    });

    // Add creator as owner
    await tx.orgMembership.create({
      data: {
        organizationId: organization.id,
        userId,
        role: OrgRole.OWNER,
      },
    });

    // Create default free subscription
    const freePlan = await tx.plan.findFirst({
      where: { slug: 'free' },
    });

    if (freePlan) {
      await tx.subscription.create({
        data: {
          organizationId: organization.id,
          planId: freePlan.id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return organization;
  });

  logger.info('Organization created', {
    organizationId: org.id,
    userId,
  });

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    logoUrl: org.logoUrl,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    memberCount: 1,
    currentUserRole: OrgRole.OWNER,
  };
}

/**
 * Update organization
 */
export async function updateOrganization(
  orgId: string,
  userId: string,
  input: UpdateOrganizationInput
): Promise<OrganizationWithMembership> {
  // Check membership and permission
  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new NotFoundError('Organization');
  }

  if (!hasPermission(membership.role, OrgRole.ADMIN)) {
    throw new ForbiddenError('Only admins can update organization settings');
  }

  // Check slug uniqueness if changing
  if (input.slug) {
    const existing = await prisma.organization.findFirst({
      where: {
        slug: input.slug,
        id: { not: orgId },
      },
    });

    if (existing) {
      throw new ConflictError('Organization slug already exists');
    }
  }

  const org = await prisma.organization.update({
    where: { id: orgId },
    data: {
      name: input.name,
      slug: input.slug,
      logoUrl: input.logoUrl,
    },
    include: {
      _count: {
        select: { memberships: true },
      },
    },
  });

  logger.info('Organization updated', {
    organizationId: orgId,
    userId,
  });

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    logoUrl: org.logoUrl,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    memberCount: org._count.memberships,
    currentUserRole: membership.role,
  };
}

/**
 * Delete organization (soft delete)
 */
export async function deleteOrganization(
  orgId: string,
  userId: string
): Promise<void> {
  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new NotFoundError('Organization');
  }

  if (membership.role !== OrgRole.OWNER) {
    throw new ForbiddenError('Only owners can delete the organization');
  }

  await prisma.organization.update({
    where: { id: orgId },
    data: { deletedAt: new Date() },
  });

  logger.info('Organization deleted', {
    organizationId: orgId,
    userId,
  });
}

/**
 * Get organization members
 */
export async function getMembers(
  orgId: string,
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ members: MemberInfo[]; total: number }> {
  // Verify membership
  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new NotFoundError('Organization');
  }

  const [memberships, total] = await Promise.all([
    prisma.orgMembership.findMany({
      where: { organizationId: orgId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'asc' },
    }),
    prisma.orgMembership.count({ where: { organizationId: orgId } }),
  ]);

  const members = memberships.map((m) => ({
    id: m.id,
    userId: m.user.id,
    email: m.user.email,
    name: m.user.name,
    avatarUrl: m.user.avatarUrl,
    role: m.role,
    joinedAt: m.createdAt,
  }));

  return { members, total };
}

/**
 * Invite member to organization
 * Supports both existing users (instant add) and new users (pending invitation)
 */
export async function inviteMember(
  orgId: string,
  userId: string,
  input: InviteMemberInput
): Promise<MemberInfo | { pendingInvitation: true; email: string; expiresAt: Date }> {
  // Check permission
  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
    include: {
      organization: {
        select: { name: true },
      },
      user: {
        select: { name: true },
      },
    },
  });

  if (!membership) {
    throw new NotFoundError('Organization');
  }

  if (!hasPermission(membership.role, OrgRole.ADMIN)) {
    throw new ForbiddenError('Only admins can invite members');
  }

  // Cannot invite with higher role than self
  if (input.role === OrgRole.OWNER && membership.role !== OrgRole.OWNER) {
    throw new ForbiddenError('Cannot invite with owner role');
  }

  // Check plan user limits
  await checkUserLimit(orgId);

  // Check if user exists
  const invitedUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!invitedUser) {
    // Check for existing pending invitation
    const existingInvitation = await prisma.pendingInvitation.findFirst({
      where: {
        organizationId: orgId,
        email: input.email.toLowerCase(),
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new ConflictError('An invitation has already been sent to this email');
    }

    // Create pending invitation
    const invitationToken = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.pendingInvitation.create({
      data: {
        organizationId: orgId,
        email: input.email.toLowerCase(),
        role: input.role,
        token: invitationToken,
        invitedById: userId,
        expiresAt,
      },
    });

    // Send invitation email
    sendInvitationEmail(
      input.email.toLowerCase(),
      membership.user.name,
      membership.organization.name,
      input.role,
      invitationToken
    ).catch((err) => {
      logger.error('Failed to send invitation email', {
        email: input.email,
        organizationId: orgId,
      }, err as Error);
    });

    logger.info('Pending invitation created', {
      organizationId: orgId,
      email: input.email.toLowerCase(),
      role: input.role,
      invitedBy: userId,
    });

    return {
      pendingInvitation: true,
      email: input.email.toLowerCase(),
      expiresAt,
    };
  }

  // Check if already a member
  const existingMembership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: invitedUser.id,
      },
    },
  });

  if (existingMembership) {
    throw new ConflictError('User is already a member of this organization');
  }

  // Add member directly (user exists)
  const newMembership = await prisma.orgMembership.create({
    data: {
      organizationId: orgId,
      userId: invitedUser.id,
      role: input.role,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  // Notify user of being added
  sendInvitationEmail(
    invitedUser.email,
    membership.user.name,
    membership.organization.name,
    input.role,
    '' // No token needed for existing users
  ).catch((err) => {
    logger.error('Failed to send membership notification', {
      userId: invitedUser.id,
      organizationId: orgId,
    }, err as Error);
  });

  logger.info('Member added to organization', {
    organizationId: orgId,
    userId: invitedUser.id,
    role: input.role,
    invitedBy: userId,
  });

  return {
    id: newMembership.id,
    userId: newMembership.user.id,
    email: newMembership.user.email,
    name: newMembership.user.name,
    avatarUrl: newMembership.user.avatarUrl,
    role: newMembership.role,
    joinedAt: newMembership.createdAt,
  };
}

/**
 * Accept a pending invitation
 */
export async function acceptInvitation(
  token: string,
  userId: string
): Promise<MemberInfo> {
  const invitation = await prisma.pendingInvitation.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invitation) {
    throw new NotFoundError('Invitation');
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new ForbiddenError('Invitation has already been used or revoked');
  }

  if (invitation.expiresAt < new Date()) {
    await prisma.pendingInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.EXPIRED },
    });
    throw new ForbiddenError('Invitation has expired');
  }

  // Get the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  // Verify email matches invitation
  if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
    throw new ForbiddenError('This invitation was sent to a different email address');
  }

  // Check if already a member
  const existingMembership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: invitation.organizationId,
        userId,
      },
    },
  });

  if (existingMembership) {
    throw new ConflictError('You are already a member of this organization');
  }

  // Create membership and update invitation in transaction
  const newMembership = await prisma.$transaction(async (tx) => {
    await tx.pendingInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED },
    });

    return tx.orgMembership.create({
      data: {
        organizationId: invitation.organizationId,
        userId,
        role: invitation.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  });

  logger.info('Invitation accepted', {
    organizationId: invitation.organizationId,
    userId,
    invitationId: invitation.id,
  });

  return {
    id: newMembership.id,
    userId: newMembership.user.id,
    email: newMembership.user.email,
    name: newMembership.user.name,
    avatarUrl: newMembership.user.avatarUrl,
    role: newMembership.role,
    joinedAt: newMembership.createdAt,
  };
}

/**
 * Get pending invitations for an organization
 */
export async function getPendingInvitations(
  orgId: string,
  userId: string
): Promise<Array<{
  id: string;
  email: string;
  role: OrgRole;
  invitedBy: string;
  expiresAt: Date;
  createdAt: Date;
}>> {
  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new NotFoundError('Organization');
  }

  if (!hasPermission(membership.role, OrgRole.ADMIN)) {
    throw new ForbiddenError('Only admins can view pending invitations');
  }

  const invitations = await prisma.pendingInvitation.findMany({
    where: {
      organizationId: orgId,
      status: InvitationStatus.PENDING,
      expiresAt: { gt: new Date() },
    },
    include: {
      invitedBy: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return invitations.map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role,
    invitedBy: inv.invitedBy.name,
    expiresAt: inv.expiresAt,
    createdAt: inv.createdAt,
  }));
}

/**
 * Revoke a pending invitation
 */
export async function revokeInvitation(
  orgId: string,
  invitationId: string,
  userId: string
): Promise<void> {
  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new NotFoundError('Organization');
  }

  if (!hasPermission(membership.role, OrgRole.ADMIN)) {
    throw new ForbiddenError('Only admins can revoke invitations');
  }

  const invitation = await prisma.pendingInvitation.findFirst({
    where: {
      id: invitationId,
      organizationId: orgId,
      status: InvitationStatus.PENDING,
    },
  });

  if (!invitation) {
    throw new NotFoundError('Invitation');
  }

  await prisma.pendingInvitation.update({
    where: { id: invitationId },
    data: { status: InvitationStatus.REVOKED },
  });

  logger.info('Invitation revoked', {
    organizationId: orgId,
    invitationId,
    revokedBy: userId,
  });
}

/**
 * Update member role
 */
export async function updateMemberRole(
  orgId: string,
  memberId: string,
  userId: string,
  input: UpdateMemberRoleInput
): Promise<MemberInfo> {
  // Check permission
  const userMembership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  if (!userMembership) {
    throw new NotFoundError('Organization');
  }

  if (!hasPermission(userMembership.role, OrgRole.ADMIN)) {
    throw new ForbiddenError('Only admins can update member roles');
  }

  // Get target membership
  const targetMembership = await prisma.orgMembership.findUnique({
    where: { id: memberId },
    include: { user: true },
  });

  if (!targetMembership || targetMembership.organizationId !== orgId) {
    throw new NotFoundError('Member');
  }

  // Cannot modify owner's role unless you're an owner
  if (targetMembership.role === OrgRole.OWNER && userMembership.role !== OrgRole.OWNER) {
    throw new ForbiddenError('Cannot modify owner role');
  }

  // Cannot set owner role unless you're an owner
  if (input.role === OrgRole.OWNER && userMembership.role !== OrgRole.OWNER) {
    throw new ForbiddenError('Only owners can promote to owner');
  }

  const updated = await prisma.orgMembership.update({
    where: { id: memberId },
    data: { role: input.role },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  logger.info('Member role updated', {
    organizationId: orgId,
    memberId,
    newRole: input.role,
    updatedBy: userId,
  });

  return {
    id: updated.id,
    userId: updated.user.id,
    email: updated.user.email,
    name: updated.user.name,
    avatarUrl: updated.user.avatarUrl,
    role: updated.role,
    joinedAt: updated.createdAt,
  };
}

/**
 * Remove member from organization
 */
export async function removeMember(
  orgId: string,
  memberId: string,
  userId: string
): Promise<void> {
  // Check permission
  const userMembership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  if (!userMembership) {
    throw new NotFoundError('Organization');
  }

  // Get target membership
  const targetMembership = await prisma.orgMembership.findUnique({
    where: { id: memberId },
  });

  if (!targetMembership || targetMembership.organizationId !== orgId) {
    throw new NotFoundError('Member');
  }

  // Users can remove themselves
  const isSelf = targetMembership.userId === userId;

  if (!isSelf && !hasPermission(userMembership.role, OrgRole.ADMIN)) {
    throw new ForbiddenError('Only admins can remove members');
  }

  // Cannot remove owner unless they're the only owner
  if (targetMembership.role === OrgRole.OWNER) {
    const ownerCount = await prisma.orgMembership.count({
      where: {
        organizationId: orgId,
        role: OrgRole.OWNER,
      },
    });

    if (ownerCount <= 1) {
      throw new ForbiddenError('Cannot remove the only owner. Transfer ownership first.');
    }
  }

  await prisma.orgMembership.delete({
    where: { id: memberId },
  });

  logger.info('Member removed from organization', {
    organizationId: orgId,
    memberId,
    removedBy: userId,
  });
}

/**
 * Check user's role in organization
 */
export async function getUserRole(
  orgId: string,
  userId: string
): Promise<OrgRole | null> {
  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
  });

  return membership?.role ?? null;
}

/**
 * Verify user has at least the required role
 */
export async function requireRole(
  orgId: string,
  userId: string,
  requiredRole: OrgRole
): Promise<OrgRole> {
  const role = await getUserRole(orgId, userId);

  if (!role) {
    throw new NotFoundError('Organization');
  }

  if (!hasPermission(role, requiredRole)) {
    throw new ForbiddenError(`Requires ${requiredRole} role or higher`);
  }

  return role;
}
