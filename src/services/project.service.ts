/**
 * Project Service
 * Handles projects, personas, and moments CRUD operations
 */

import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import * as orgService from './organization.service.js';
import { checkProjectLimit } from './plan.service.js';
import type {
  CreateProjectInput,
  UpdateProjectInput,
  CreatePersonaInput,
  UpdatePersonaInput,
  CreateMomentInput,
  UpdateMomentInput,
  ProjectQueryParams,
} from '../schemas/project.schema.js';
import { OrgRole, ProjectStatus } from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  personaCount: number;
  momentCount: number;
  widgetCount: number;
}

export interface ProjectDetail extends ProjectSummary {
  personas: PersonaSummary[];
  moments: MomentSummary[];
  organizationId: string;
  createdByUserId: string | null;
}

export interface PersonaSummary {
  id: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  attributes: Record<string, unknown>;
  createdAt: Date;
}

export interface MomentSummary {
  id: string;
  name: string;
  description: string | null;
  iconEmoji: string | null;
  orderIndex: number;
  createdAt: Date;
  personaIds: string[];
}

// ============================================================================
// Projects
// ============================================================================

/**
 * Get projects for organization
 */
export async function getProjects(
  orgId: string,
  userId: string,
  query: ProjectQueryParams
): Promise<{ projects: ProjectSummary[]; total: number }> {
  // Verify membership
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const where = {
    organizationId: orgId,
    deletedAt: null,
    ...(query.status && { status: query.status }),
  };

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        _count: {
          select: {
            personas: { where: { deletedAt: null } },
            moments: { where: { deletedAt: null } },
            widgets: { where: { deletedAt: null } },
          },
        },
      },
      take: query.limit,
      skip: query.offset,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      iconUrl: p.iconUrl,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      personaCount: p._count.personas,
      momentCount: p._count.moments,
      widgetCount: p._count.widgets,
    })),
    total,
  };
}

/**
 * Get project by ID
 */
export async function getProject(
  projectId: string,
  orgId: string,
  userId: string
): Promise<ProjectDetail> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
      deletedAt: null,
    },
    include: {
      personas: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'asc' },
      },
      moments: {
        where: { deletedAt: null },
        orderBy: { orderIndex: 'asc' },
        include: {
          momentPersonas: true,
        },
      },
      _count: {
        select: {
          personas: { where: { deletedAt: null } },
          moments: { where: { deletedAt: null } },
          widgets: { where: { deletedAt: null } },
        },
      },
    },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    iconUrl: project.iconUrl,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    organizationId: project.organizationId,
    createdByUserId: project.createdByUserId,
    personaCount: project._count.personas,
    momentCount: project._count.moments,
    widgetCount: project._count.widgets,
    personas: project.personas.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      avatarUrl: p.avatarUrl,
      attributes: p.attributes as Record<string, unknown>,
      createdAt: p.createdAt,
    })),
    moments: project.moments.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      iconEmoji: m.iconEmoji,
      orderIndex: m.orderIndex,
      createdAt: m.createdAt,
      personaIds: m.momentPersonas.map((mp) => mp.personaId),
    })),
  };
}

/**
 * Create a new project
 */
export async function createProject(
  orgId: string,
  userId: string,
  input: CreateProjectInput
): Promise<ProjectDetail> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  // Check plan limits
  await checkProjectLimit(orgId);

  const project = await prisma.project.create({
    data: {
      organizationId: orgId,
      name: input.name,
      description: input.description,
      iconUrl: input.iconUrl,
      createdByUserId: userId,
    },
  });

  logger.info('Project created', {
    projectId: project.id,
    organizationId: orgId,
    userId,
  });

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    iconUrl: project.iconUrl,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    organizationId: project.organizationId,
    createdByUserId: project.createdByUserId,
    personaCount: 0,
    momentCount: 0,
    widgetCount: 0,
    personas: [],
    moments: [],
  };
}

/**
 * Update project
 */
export async function updateProject(
  projectId: string,
  orgId: string,
  userId: string,
  input: UpdateProjectInput
): Promise<ProjectDetail> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: input.name,
      description: input.description,
      iconUrl: input.iconUrl,
      status: input.status,
    },
    include: {
      personas: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'asc' },
      },
      moments: {
        where: { deletedAt: null },
        orderBy: { orderIndex: 'asc' },
        include: { momentPersonas: true },
      },
      _count: {
        select: {
          personas: { where: { deletedAt: null } },
          moments: { where: { deletedAt: null } },
          widgets: { where: { deletedAt: null } },
        },
      },
    },
  });

  logger.info('Project updated', {
    projectId,
    organizationId: orgId,
    userId,
  });

  return {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    iconUrl: updated.iconUrl,
    status: updated.status,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    organizationId: updated.organizationId,
    createdByUserId: updated.createdByUserId,
    personaCount: updated._count.personas,
    momentCount: updated._count.moments,
    widgetCount: updated._count.widgets,
    personas: updated.personas.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      avatarUrl: p.avatarUrl,
      attributes: p.attributes as Record<string, unknown>,
      createdAt: p.createdAt,
    })),
    moments: updated.moments.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      iconEmoji: m.iconEmoji,
      orderIndex: m.orderIndex,
      createdAt: m.createdAt,
      personaIds: m.momentPersonas.map((mp) => mp.personaId),
    })),
  };
}

/**
 * Delete project (soft delete)
 */
export async function deleteProject(
  projectId: string,
  orgId: string,
  userId: string
): Promise<void> {
  await orgService.requireRole(orgId, userId, OrgRole.ADMIN);

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { deletedAt: new Date() },
  });

  logger.info('Project deleted', {
    projectId,
    organizationId: orgId,
    userId,
  });
}

// ============================================================================
// Personas
// ============================================================================

/**
 * Get personas for project
 */
export async function getPersonas(
  projectId: string,
  orgId: string,
  userId: string
): Promise<PersonaSummary[]> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId, deletedAt: null },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  const personas = await prisma.persona.findMany({
    where: { projectId, deletedAt: null },
    orderBy: { createdAt: 'asc' },
  });

  return personas.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    avatarUrl: p.avatarUrl,
    attributes: p.attributes as Record<string, unknown>,
    createdAt: p.createdAt,
  }));
}

/**
 * Create persona
 */
export async function createPersona(
  projectId: string,
  orgId: string,
  userId: string,
  input: CreatePersonaInput
): Promise<PersonaSummary> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId, deletedAt: null },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  const persona = await prisma.persona.create({
    data: {
      projectId,
      name: input.name,
      description: input.description,
      avatarUrl: input.avatarUrl,
      attributes: input.attributes,
    },
  });

  logger.info('Persona created', {
    personaId: persona.id,
    projectId,
    userId,
  });

  return {
    id: persona.id,
    name: persona.name,
    description: persona.description,
    avatarUrl: persona.avatarUrl,
    attributes: persona.attributes as Record<string, unknown>,
    createdAt: persona.createdAt,
  };
}

/**
 * Update persona
 */
export async function updatePersona(
  personaId: string,
  projectId: string,
  orgId: string,
  userId: string,
  input: UpdatePersonaInput
): Promise<PersonaSummary> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const persona = await prisma.persona.findFirst({
    where: { id: personaId, projectId, deletedAt: null },
    include: { project: true },
  });

  if (!persona || persona.project.organizationId !== orgId) {
    throw new NotFoundError('Persona');
  }

  const updated = await prisma.persona.update({
    where: { id: personaId },
    data: {
      name: input.name,
      description: input.description,
      avatarUrl: input.avatarUrl,
      attributes: input.attributes,
    },
  });

  logger.info('Persona updated', {
    personaId,
    projectId,
    userId,
  });

  return {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    avatarUrl: updated.avatarUrl,
    attributes: updated.attributes as Record<string, unknown>,
    createdAt: updated.createdAt,
  };
}

/**
 * Delete persona (soft delete)
 */
export async function deletePersona(
  personaId: string,
  projectId: string,
  orgId: string,
  userId: string
): Promise<void> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const persona = await prisma.persona.findFirst({
    where: { id: personaId, projectId, deletedAt: null },
    include: { project: true },
  });

  if (!persona || persona.project.organizationId !== orgId) {
    throw new NotFoundError('Persona');
  }

  await prisma.persona.update({
    where: { id: personaId },
    data: { deletedAt: new Date() },
  });

  logger.info('Persona deleted', {
    personaId,
    projectId,
    userId,
  });
}

// ============================================================================
// Moments
// ============================================================================

/**
 * Get moments for project
 */
export async function getMoments(
  projectId: string,
  orgId: string,
  userId: string
): Promise<MomentSummary[]> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId, deletedAt: null },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  const moments = await prisma.moment.findMany({
    where: { projectId, deletedAt: null },
    include: { momentPersonas: true },
    orderBy: { orderIndex: 'asc' },
  });

  return moments.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
    iconEmoji: m.iconEmoji,
    orderIndex: m.orderIndex,
    createdAt: m.createdAt,
    personaIds: m.momentPersonas.map((mp) => mp.personaId),
  }));
}

/**
 * Create moment
 */
export async function createMoment(
  projectId: string,
  orgId: string,
  userId: string,
  input: CreateMomentInput
): Promise<MomentSummary> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId, deletedAt: null },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  // Get next order index if not specified
  let orderIndex = input.orderIndex;
  if (orderIndex === 0) {
    const lastMoment = await prisma.moment.findFirst({
      where: { projectId, deletedAt: null },
      orderBy: { orderIndex: 'desc' },
    });
    orderIndex = (lastMoment?.orderIndex ?? -1) + 1;
  }

  const moment = await prisma.$transaction(async (tx) => {
    const m = await tx.moment.create({
      data: {
        projectId,
        name: input.name,
        description: input.description,
        iconEmoji: input.iconEmoji,
        orderIndex,
      },
    });

    // Create persona links if provided
    if (input.personaIds.length > 0) {
      await tx.momentPersona.createMany({
        data: input.personaIds.map((personaId) => ({
          momentId: m.id,
          personaId,
        })),
      });
    }

    return m;
  });

  logger.info('Moment created', {
    momentId: moment.id,
    projectId,
    userId,
  });

  return {
    id: moment.id,
    name: moment.name,
    description: moment.description,
    iconEmoji: moment.iconEmoji,
    orderIndex: moment.orderIndex,
    createdAt: moment.createdAt,
    personaIds: input.personaIds,
  };
}

/**
 * Update moment
 */
export async function updateMoment(
  momentId: string,
  projectId: string,
  orgId: string,
  userId: string,
  input: UpdateMomentInput
): Promise<MomentSummary> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const moment = await prisma.moment.findFirst({
    where: { id: momentId, projectId, deletedAt: null },
    include: { project: true, momentPersonas: true },
  });

  if (!moment || moment.project.organizationId !== orgId) {
    throw new NotFoundError('Moment');
  }

  const updated = await prisma.$transaction(async (tx) => {
    const m = await tx.moment.update({
      where: { id: momentId },
      data: {
        name: input.name,
        description: input.description,
        iconEmoji: input.iconEmoji,
        orderIndex: input.orderIndex,
      },
    });

    // Update persona links if provided
    if (input.personaIds !== undefined) {
      await tx.momentPersona.deleteMany({
        where: { momentId },
      });

      if (input.personaIds.length > 0) {
        await tx.momentPersona.createMany({
          data: input.personaIds.map((personaId) => ({
            momentId,
            personaId,
          })),
        });
      }
    }

    return m;
  });

  const personaIds = input.personaIds ?? moment.momentPersonas.map((mp) => mp.personaId);

  logger.info('Moment updated', {
    momentId,
    projectId,
    userId,
  });

  return {
    id: updated.id,
    name: updated.name,
    description: updated.description,
    iconEmoji: updated.iconEmoji,
    orderIndex: updated.orderIndex,
    createdAt: updated.createdAt,
    personaIds,
  };
}

/**
 * Delete moment (soft delete)
 */
export async function deleteMoment(
  momentId: string,
  projectId: string,
  orgId: string,
  userId: string
): Promise<void> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const moment = await prisma.moment.findFirst({
    where: { id: momentId, projectId, deletedAt: null },
    include: { project: true },
  });

  if (!moment || moment.project.organizationId !== orgId) {
    throw new NotFoundError('Moment');
  }

  await prisma.moment.update({
    where: { id: momentId },
    data: { deletedAt: new Date() },
  });

  logger.info('Moment deleted', {
    momentId,
    projectId,
    userId,
  });
}

/**
 * Reorder moments
 */
export async function reorderMoments(
  projectId: string,
  orgId: string,
  userId: string,
  momentIds: string[]
): Promise<MomentSummary[]> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId, deletedAt: null },
  });

  if (!project) {
    throw new NotFoundError('Project');
  }

  // Update order indices in transaction
  await prisma.$transaction(
    momentIds.map((id, index) =>
      prisma.moment.update({
        where: { id },
        data: { orderIndex: index },
      })
    )
  );

  logger.info('Moments reordered', {
    projectId,
    userId,
  });

  // Return updated moments
  return getMoments(projectId, orgId, userId);
}

/**
 * Verify project belongs to organization
 */
export async function verifyProjectAccess(
  projectId: string,
  orgId: string
): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
      deletedAt: null,
    },
  });

  return project !== null;
}
