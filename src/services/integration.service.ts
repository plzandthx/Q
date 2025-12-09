/**
 * Integration Service
 * Handles integration connections, inbound events, and outbound actions
 */

import { prisma } from '../lib/prisma.js';
import { NotFoundError, ValidationError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { encrypt, decrypt } from '../lib/crypto.js';
import * as orgService from './organization.service.js';
import type {
  CreateIntegrationInput,
  UpdateIntegrationInput,
  UpsertConnectionInput,
  CreateProjectIntegrationInput,
  UpdateProjectIntegrationInput,
  CreateOutboundActionInput,
  ConnectionConfig,
  ProjectIntegrationSettings,
} from '../schemas/integration.schema.js';
import {
  OrgRole,
  IntegrationType,
  IntegrationDirection,
  ConnectionStatus,
  ConnectionAuthType,
  InboundEventStatus,
  OutboundActionStatus,
  OutboundActionType,
  InboundSourceType,
} from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export interface IntegrationInfo {
  id: string;
  type: IntegrationType;
  direction: IntegrationDirection;
  displayName: string;
  description: string | null;
  iconUrl: string | null;
  isEnabled: boolean;
  connectionStatus?: ConnectionStatus;
  lastSyncedAt?: Date | null;
  createdAt: Date;
}

export interface IntegrationConnectionInfo {
  id: string;
  integrationId: string;
  status: ConnectionStatus;
  authType: ConnectionAuthType;
  config: ConnectionConfig;
  lastSyncedAt: Date | null;
  lastErrorAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
}

export interface ProjectIntegrationInfo {
  id: string;
  projectId: string;
  integrationId: string;
  integrationName: string;
  integrationType: IntegrationType;
  momentId: string | null;
  momentName?: string;
  settings: ProjectIntegrationSettings;
  isEnabled: boolean;
  createdAt: Date;
}

export interface InboundEventInfo {
  id: string;
  integrationId: string;
  projectId: string;
  momentId: string | null;
  externalId: string;
  sourceType: InboundSourceType;
  normalizedScore: number | null;
  status: InboundEventStatus;
  errorMessage: string | null;
  receivedAt: Date;
  processedAt: Date | null;
}

export interface OutboundActionInfo {
  id: string;
  integrationId: string;
  projectId: string;
  actionType: OutboundActionType;
  externalItemId: string | null;
  status: OutboundActionStatus;
  errorMessage: string | null;
  attemptCount: number;
  createdAt: Date;
  completedAt: Date | null;
}

// Integration type metadata
export const INTEGRATION_CATALOG: Record<
  IntegrationType,
  {
    name: string;
    description: string;
    direction: IntegrationDirection;
    authTypes: ConnectionAuthType[];
    iconUrl?: string;
  }
> = {
  ZENDESK: {
    name: 'Zendesk',
    description: 'Import tickets and satisfaction ratings from Zendesk',
    direction: IntegrationDirection.INBOUND,
    authTypes: [ConnectionAuthType.OAUTH2, ConnectionAuthType.API_KEY],
  },
  GA4: {
    name: 'Google Analytics 4',
    description: 'Import conversion events and user behavior data',
    direction: IntegrationDirection.INBOUND,
    authTypes: [ConnectionAuthType.OAUTH2],
  },
  APP_STORE: {
    name: 'Apple App Store',
    description: 'Import app reviews and ratings',
    direction: IntegrationDirection.INBOUND,
    authTypes: [ConnectionAuthType.API_KEY],
  },
  PLAY_STORE: {
    name: 'Google Play Store',
    description: 'Import app reviews and ratings',
    direction: IntegrationDirection.INBOUND,
    authTypes: [ConnectionAuthType.API_KEY],
  },
  TABLEAU: {
    name: 'Tableau',
    description: 'Import data from Tableau dashboards',
    direction: IntegrationDirection.INBOUND,
    authTypes: [ConnectionAuthType.API_KEY],
  },
  JIRA: {
    name: 'Jira',
    description: 'Create and sync issues in Jira',
    direction: IntegrationDirection.OUTBOUND,
    authTypes: [ConnectionAuthType.OAUTH2, ConnectionAuthType.API_KEY],
  },
  ASANA: {
    name: 'Asana',
    description: 'Create and sync tasks in Asana',
    direction: IntegrationDirection.OUTBOUND,
    authTypes: [ConnectionAuthType.OAUTH2],
  },
  MONDAY: {
    name: 'Monday.com',
    description: 'Create and sync items in Monday.com',
    direction: IntegrationDirection.OUTBOUND,
    authTypes: [ConnectionAuthType.API_KEY],
  },
  AIRTABLE: {
    name: 'Airtable',
    description: 'Create and sync records in Airtable',
    direction: IntegrationDirection.OUTBOUND,
    authTypes: [ConnectionAuthType.API_KEY],
  },
  WRIKE: {
    name: 'Wrike',
    description: 'Create and sync tasks in Wrike',
    direction: IntegrationDirection.OUTBOUND,
    authTypes: [ConnectionAuthType.OAUTH2, ConnectionAuthType.API_KEY],
  },
};

// ============================================================================
// Integration Catalog
// ============================================================================

/**
 * Get integration catalog
 */
export function getIntegrationCatalog(): Array<{
  type: IntegrationType;
  name: string;
  description: string;
  direction: IntegrationDirection;
  authTypes: ConnectionAuthType[];
}> {
  return Object.entries(INTEGRATION_CATALOG).map(([type, info]) => ({
    type: type as IntegrationType,
    ...info,
  }));
}

// ============================================================================
// Integrations
// ============================================================================

/**
 * Get integrations for organization
 */
export async function getIntegrations(
  orgId: string,
  userId: string
): Promise<IntegrationInfo[]> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const integrations = await prisma.integration.findMany({
    where: { organizationId: orgId, deletedAt: null },
    include: {
      connections: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return integrations.map((i) => ({
    id: i.id,
    type: i.type,
    direction: i.direction,
    displayName: i.displayName,
    description: i.description,
    iconUrl: i.iconUrl,
    isEnabled: i.isEnabled,
    connectionStatus: i.connections[0]?.status,
    lastSyncedAt: i.connections[0]?.lastSyncedAt,
    createdAt: i.createdAt,
  }));
}

/**
 * Get integration by ID
 */
export async function getIntegration(
  integrationId: string,
  orgId: string,
  userId: string
): Promise<IntegrationInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, organizationId: orgId, deletedAt: null },
    include: {
      connections: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!integration) {
    throw new NotFoundError('Integration');
  }

  return {
    id: integration.id,
    type: integration.type,
    direction: integration.direction,
    displayName: integration.displayName,
    description: integration.description,
    iconUrl: integration.iconUrl,
    isEnabled: integration.isEnabled,
    connectionStatus: integration.connections[0]?.status,
    lastSyncedAt: integration.connections[0]?.lastSyncedAt,
    createdAt: integration.createdAt,
  };
}

/**
 * Create integration
 */
export async function createIntegration(
  orgId: string,
  userId: string,
  input: CreateIntegrationInput
): Promise<IntegrationInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.ADMIN);

  // Validate integration type
  const catalog = INTEGRATION_CATALOG[input.type];
  if (!catalog) {
    throw new ValidationError(`Unknown integration type: ${input.type}`);
  }

  const integration = await prisma.integration.create({
    data: {
      organizationId: orgId,
      type: input.type,
      direction: input.direction,
      displayName: input.displayName,
      description: input.description,
      iconUrl: catalog.iconUrl,
    },
  });

  logger.info('Integration created', {
    integrationId: integration.id,
    organizationId: orgId,
    type: input.type,
    userId,
  });

  return {
    id: integration.id,
    type: integration.type,
    direction: integration.direction,
    displayName: integration.displayName,
    description: integration.description,
    iconUrl: integration.iconUrl,
    isEnabled: integration.isEnabled,
    createdAt: integration.createdAt,
  };
}

/**
 * Update integration
 */
export async function updateIntegration(
  integrationId: string,
  orgId: string,
  userId: string,
  input: UpdateIntegrationInput
): Promise<IntegrationInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.ADMIN);

  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, organizationId: orgId, deletedAt: null },
  });

  if (!integration) {
    throw new NotFoundError('Integration');
  }

  const updated = await prisma.integration.update({
    where: { id: integrationId },
    data: {
      displayName: input.displayName,
      description: input.description,
      isEnabled: input.isEnabled,
    },
    include: {
      connections: { take: 1, orderBy: { createdAt: 'desc' } },
    },
  });

  logger.info('Integration updated', {
    integrationId,
    organizationId: orgId,
    userId,
  });

  return {
    id: updated.id,
    type: updated.type,
    direction: updated.direction,
    displayName: updated.displayName,
    description: updated.description,
    iconUrl: updated.iconUrl,
    isEnabled: updated.isEnabled,
    connectionStatus: updated.connections[0]?.status,
    lastSyncedAt: updated.connections[0]?.lastSyncedAt,
    createdAt: updated.createdAt,
  };
}

/**
 * Delete integration (soft delete)
 */
export async function deleteIntegration(
  integrationId: string,
  orgId: string,
  userId: string
): Promise<void> {
  await orgService.requireRole(orgId, userId, OrgRole.ADMIN);

  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, organizationId: orgId, deletedAt: null },
  });

  if (!integration) {
    throw new NotFoundError('Integration');
  }

  await prisma.integration.update({
    where: { id: integrationId },
    data: { deletedAt: new Date() },
  });

  logger.info('Integration deleted', {
    integrationId,
    organizationId: orgId,
    userId,
  });
}

// ============================================================================
// Connections
// ============================================================================

/**
 * Get connection for integration
 */
export async function getConnection(
  integrationId: string,
  orgId: string,
  userId: string
): Promise<IntegrationConnectionInfo | null> {
  await orgService.requireRole(orgId, userId, OrgRole.ADMIN);

  const connection = await prisma.integrationConnection.findFirst({
    where: {
      integrationId,
      integration: { organizationId: orgId, deletedAt: null },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!connection) {
    return null;
  }

  return {
    id: connection.id,
    integrationId: connection.integrationId,
    status: connection.status,
    authType: connection.authType,
    config: connection.configJson as ConnectionConfig,
    lastSyncedAt: connection.lastSyncedAt,
    lastErrorAt: connection.lastErrorAt,
    errorMessage: connection.errorMessage,
    createdAt: connection.createdAt,
  };
}

/**
 * Upsert connection
 */
export async function upsertConnection(
  integrationId: string,
  orgId: string,
  userId: string,
  input: UpsertConnectionInput
): Promise<IntegrationConnectionInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.ADMIN);

  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, organizationId: orgId, deletedAt: null },
  });

  if (!integration) {
    throw new NotFoundError('Integration');
  }

  // Encrypt tokens if provided
  const accessTokenEncrypted = input.accessToken ? encrypt(input.accessToken) : undefined;
  const refreshTokenEncrypted = input.refreshToken ? encrypt(input.refreshToken) : undefined;

  // Find existing connection
  const existing = await prisma.integrationConnection.findFirst({
    where: { integrationId },
  });

  let connection;
  if (existing) {
    connection = await prisma.integrationConnection.update({
      where: { id: existing.id },
      data: {
        authType: input.authType,
        accessTokenEncrypted,
        refreshTokenEncrypted,
        expiresAt: input.expiresAt,
        configJson: input.config,
        status: ConnectionStatus.CONNECTED,
        errorMessage: null,
        errorCount: 0,
      },
    });
  } else {
    connection = await prisma.integrationConnection.create({
      data: {
        integrationId,
        authType: input.authType,
        accessTokenEncrypted,
        refreshTokenEncrypted,
        expiresAt: input.expiresAt,
        configJson: input.config,
        status: ConnectionStatus.CONNECTED,
      },
    });
  }

  logger.info('Integration connection upserted', {
    connectionId: connection.id,
    integrationId,
    userId,
  });

  return {
    id: connection.id,
    integrationId: connection.integrationId,
    status: connection.status,
    authType: connection.authType,
    config: connection.configJson as ConnectionConfig,
    lastSyncedAt: connection.lastSyncedAt,
    lastErrorAt: connection.lastErrorAt,
    errorMessage: connection.errorMessage,
    createdAt: connection.createdAt,
  };
}

/**
 * Disconnect integration
 */
export async function disconnectIntegration(
  integrationId: string,
  orgId: string,
  userId: string
): Promise<void> {
  await orgService.requireRole(orgId, userId, OrgRole.ADMIN);

  const connection = await prisma.integrationConnection.findFirst({
    where: {
      integrationId,
      integration: { organizationId: orgId, deletedAt: null },
    },
  });

  if (connection) {
    await prisma.integrationConnection.update({
      where: { id: connection.id },
      data: {
        status: ConnectionStatus.DISCONNECTED,
        accessTokenEncrypted: null,
        refreshTokenEncrypted: null,
      },
    });
  }

  logger.info('Integration disconnected', {
    integrationId,
    organizationId: orgId,
    userId,
  });
}

// ============================================================================
// Project Integrations
// ============================================================================

/**
 * Get project integrations
 */
export async function getProjectIntegrations(
  projectId: string,
  orgId: string,
  userId: string
): Promise<ProjectIntegrationInfo[]> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const projectIntegrations = await prisma.projectIntegration.findMany({
    where: {
      projectId,
      project: { organizationId: orgId, deletedAt: null },
    },
    include: {
      integration: true,
      moment: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return projectIntegrations.map((pi) => ({
    id: pi.id,
    projectId: pi.projectId,
    integrationId: pi.integrationId,
    integrationName: pi.integration.displayName,
    integrationType: pi.integration.type,
    momentId: pi.momentId,
    momentName: pi.moment?.name,
    settings: pi.settingsJson as ProjectIntegrationSettings,
    isEnabled: pi.isEnabled,
    createdAt: pi.createdAt,
  }));
}

/**
 * Create project integration
 */
export async function createProjectIntegration(
  projectId: string,
  orgId: string,
  userId: string,
  input: CreateProjectIntegrationInput
): Promise<ProjectIntegrationInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  // Verify project and integration belong to org
  const [project, integration] = await Promise.all([
    prisma.project.findFirst({
      where: { id: projectId, organizationId: orgId, deletedAt: null },
    }),
    prisma.integration.findFirst({
      where: { id: input.integrationId, organizationId: orgId, deletedAt: null },
    }),
  ]);

  if (!project) {
    throw new NotFoundError('Project');
  }
  if (!integration) {
    throw new NotFoundError('Integration');
  }

  const projectIntegration = await prisma.projectIntegration.create({
    data: {
      projectId,
      integrationId: input.integrationId,
      momentId: input.momentId,
      settingsJson: input.settings,
      isEnabled: input.isEnabled,
    },
    include: {
      integration: true,
      moment: { select: { name: true } },
    },
  });

  logger.info('Project integration created', {
    projectIntegrationId: projectIntegration.id,
    projectId,
    integrationId: input.integrationId,
    userId,
  });

  return {
    id: projectIntegration.id,
    projectId: projectIntegration.projectId,
    integrationId: projectIntegration.integrationId,
    integrationName: projectIntegration.integration.displayName,
    integrationType: projectIntegration.integration.type,
    momentId: projectIntegration.momentId,
    momentName: projectIntegration.moment?.name,
    settings: projectIntegration.settingsJson as ProjectIntegrationSettings,
    isEnabled: projectIntegration.isEnabled,
    createdAt: projectIntegration.createdAt,
  };
}

/**
 * Update project integration
 */
export async function updateProjectIntegration(
  projectIntegrationId: string,
  projectId: string,
  orgId: string,
  userId: string,
  input: UpdateProjectIntegrationInput
): Promise<ProjectIntegrationInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const projectIntegration = await prisma.projectIntegration.findFirst({
    where: {
      id: projectIntegrationId,
      projectId,
      project: { organizationId: orgId, deletedAt: null },
    },
  });

  if (!projectIntegration) {
    throw new NotFoundError('Project integration');
  }

  const updated = await prisma.projectIntegration.update({
    where: { id: projectIntegrationId },
    data: {
      settingsJson: input.settings
        ? { ...projectIntegration.settingsJson as object, ...input.settings }
        : undefined,
      isEnabled: input.isEnabled,
    },
    include: {
      integration: true,
      moment: { select: { name: true } },
    },
  });

  logger.info('Project integration updated', {
    projectIntegrationId,
    projectId,
    userId,
  });

  return {
    id: updated.id,
    projectId: updated.projectId,
    integrationId: updated.integrationId,
    integrationName: updated.integration.displayName,
    integrationType: updated.integration.type,
    momentId: updated.momentId,
    momentName: updated.moment?.name,
    settings: updated.settingsJson as ProjectIntegrationSettings,
    isEnabled: updated.isEnabled,
    createdAt: updated.createdAt,
  };
}

/**
 * Delete project integration
 */
export async function deleteProjectIntegration(
  projectIntegrationId: string,
  projectId: string,
  orgId: string,
  userId: string
): Promise<void> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  const projectIntegration = await prisma.projectIntegration.findFirst({
    where: {
      id: projectIntegrationId,
      projectId,
      project: { organizationId: orgId, deletedAt: null },
    },
  });

  if (!projectIntegration) {
    throw new NotFoundError('Project integration');
  }

  await prisma.projectIntegration.delete({
    where: { id: projectIntegrationId },
  });

  logger.info('Project integration deleted', {
    projectIntegrationId,
    projectId,
    userId,
  });
}

// ============================================================================
// Inbound Events (Webhook Handlers)
// ============================================================================

/**
 * Process inbound event from webhook
 */
export async function processInboundEvent(
  integrationId: string,
  externalId: string,
  sourceType: InboundSourceType,
  payload: Record<string, unknown>,
  normalizedScore?: number
): Promise<InboundEventInfo> {
  const integration = await prisma.integration.findUnique({
    where: { id: integrationId },
    include: {
      projectIntegrations: {
        where: { isEnabled: true },
        include: { project: true },
      },
    },
  });

  if (!integration || integration.deletedAt) {
    throw new NotFoundError('Integration');
  }

  // Get first project integration (for now, could be multiple)
  const projectIntegration = integration.projectIntegrations[0];
  if (!projectIntegration) {
    throw new ValidationError('No project configured for this integration');
  }

  // Create inbound event
  const event = await prisma.inboundEvent.create({
    data: {
      integrationId,
      projectId: projectIntegration.projectId,
      momentId: projectIntegration.momentId,
      externalId,
      sourceType,
      payloadJson: payload,
      normalizedScore,
      status: InboundEventStatus.RECEIVED,
    },
  });

  // TODO: Queue for async processing
  // For now, process synchronously if we have a score
  if (normalizedScore !== undefined && normalizedScore !== null) {
    await prisma.$transaction([
      prisma.csatResponse.create({
        data: {
          projectId: projectIntegration.projectId,
          momentId: projectIntegration.momentId,
          integrationId,
          inboundEventId: event.id,
          externalReference: externalId,
          score: normalizedScore,
          metadataJson: payload,
          sourceType,
        },
      }),
      prisma.inboundEvent.update({
        where: { id: event.id },
        data: {
          status: InboundEventStatus.PROCESSED,
          processedAt: new Date(),
        },
      }),
    ]);
  }

  logger.info('Inbound event processed', {
    eventId: event.id,
    integrationId,
    sourceType,
    externalId,
  });

  return {
    id: event.id,
    integrationId: event.integrationId,
    projectId: event.projectId,
    momentId: event.momentId,
    externalId: event.externalId,
    sourceType: event.sourceType,
    normalizedScore: event.normalizedScore,
    status: event.status,
    errorMessage: event.errorMessage,
    receivedAt: event.receivedAt,
    processedAt: event.processedAt,
  };
}

// ============================================================================
// Outbound Actions
// ============================================================================

/**
 * Create outbound action (e.g., create Jira issue)
 */
export async function createOutboundAction(
  projectId: string,
  orgId: string,
  userId: string,
  input: CreateOutboundActionInput
): Promise<OutboundActionInfo> {
  await orgService.requireRole(orgId, userId, OrgRole.MEMBER);

  // Verify integration belongs to org
  const integration = await prisma.integration.findFirst({
    where: {
      id: input.integrationId,
      organizationId: orgId,
      deletedAt: null,
      direction: { in: [IntegrationDirection.OUTBOUND, IntegrationDirection.BOTH] },
    },
  });

  if (!integration) {
    throw new NotFoundError('Integration');
  }

  const action = await prisma.outboundAction.create({
    data: {
      integrationId: input.integrationId,
      projectId,
      momentId: input.momentId,
      csatResponseId: input.csatResponseId,
      recommendationId: input.recommendationId,
      actionType: input.actionType,
      payloadJson: input.payload,
      status: OutboundActionStatus.PENDING,
    },
  });

  // TODO: Queue for async execution
  // For now, just create the record

  logger.info('Outbound action created', {
    actionId: action.id,
    integrationId: input.integrationId,
    projectId,
    actionType: input.actionType,
    userId,
  });

  return {
    id: action.id,
    integrationId: action.integrationId,
    projectId: action.projectId,
    actionType: action.actionType,
    externalItemId: action.externalItemId,
    status: action.status,
    errorMessage: action.errorMessage,
    attemptCount: action.attemptCount,
    createdAt: action.createdAt,
    completedAt: action.completedAt,
  };
}

/**
 * Get recent inbound events
 */
export async function getInboundEvents(
  integrationId: string,
  orgId: string,
  userId: string,
  limit: number = 50
): Promise<InboundEventInfo[]> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const events = await prisma.inboundEvent.findMany({
    where: {
      integrationId,
      integration: { organizationId: orgId, deletedAt: null },
    },
    take: limit,
    orderBy: { receivedAt: 'desc' },
  });

  return events.map((e) => ({
    id: e.id,
    integrationId: e.integrationId,
    projectId: e.projectId,
    momentId: e.momentId,
    externalId: e.externalId,
    sourceType: e.sourceType,
    normalizedScore: e.normalizedScore,
    status: e.status,
    errorMessage: e.errorMessage,
    receivedAt: e.receivedAt,
    processedAt: e.processedAt,
  }));
}

/**
 * Get recent outbound actions
 */
export async function getOutboundActions(
  integrationId: string,
  orgId: string,
  userId: string,
  limit: number = 50
): Promise<OutboundActionInfo[]> {
  await orgService.requireRole(orgId, userId, OrgRole.VIEWER);

  const actions = await prisma.outboundAction.findMany({
    where: {
      integrationId,
      integration: { organizationId: orgId, deletedAt: null },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return actions.map((a) => ({
    id: a.id,
    integrationId: a.integrationId,
    projectId: a.projectId,
    actionType: a.actionType,
    externalItemId: a.externalItemId,
    status: a.status,
    errorMessage: a.errorMessage,
    attemptCount: a.attemptCount,
    createdAt: a.createdAt,
    completedAt: a.completedAt,
  }));
}
