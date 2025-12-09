/**
 * Job Handlers
 * Register handlers for background job processing
 */

import { registerHandler, JobTypes } from '../lib/queue.js';
import { logger } from '../lib/logger.js';
import * as emailService from '../services/email.service.js';

// ============================================================================
// Email Job Handler
// ============================================================================

interface SendEmailJobData {
  type: 'verification' | 'password_reset' | 'invitation';
  to: string;
  name: string;
  token: string;
  // For invitations
  inviterName?: string;
  organizationName?: string;
  role?: string;
}

registerHandler<SendEmailJobData>(JobTypes.SEND_EMAIL, async (job) => {
  const { type, to, name, token, inviterName, organizationName, role } = job.data;

  logger.debug('Processing email job', { type, to });

  switch (type) {
    case 'verification':
      await emailService.sendVerificationEmail(to, name, token);
      break;

    case 'password_reset':
      await emailService.sendPasswordResetEmail(to, name, token);
      break;

    case 'invitation':
      if (!inviterName || !organizationName || !role) {
        throw new Error('Missing invitation data');
      }
      await emailService.sendInvitationEmail(
        to,
        inviterName,
        organizationName,
        role,
        token
      );
      break;

    default:
      throw new Error(`Unknown email type: ${type}`);
  }

  logger.info('Email sent successfully', { type, to });
});

// ============================================================================
// Integration Inbound Event Handler
// ============================================================================

interface ProcessInboundEventJobData {
  eventId: string;
  integrationId: string;
  projectId: string;
}

registerHandler<ProcessInboundEventJobData>(
  JobTypes.PROCESS_INBOUND_EVENT,
  async (job) => {
    const { eventId } = job.data;

    logger.debug('Processing inbound event', { eventId });

    // Import dynamically to avoid circular dependencies
    const { prisma } = await import('../lib/prisma.js');
    const { InboundEventStatus } = await import('@prisma/client');

    const event = await prisma.inboundEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      logger.error('Inbound event not found', { eventId });
      return;
    }

    if (event.status === InboundEventStatus.PROCESSED) {
      logger.debug('Inbound event already processed', { eventId });
      return;
    }

    try {
      // Process based on source type
      // This is where you'd add custom logic per integration
      const payload = event.payloadJson as Record<string, unknown>;

      // For events with a normalized score, create CSAT response
      if (event.normalizedScore !== null) {
        await prisma.csatResponse.create({
          data: {
            projectId: event.projectId,
            momentId: event.momentId,
            integrationId: event.integrationId,
            inboundEventId: event.id,
            externalReference: event.externalId,
            score: event.normalizedScore,
            sourceType: event.sourceType,
            metadataJson: payload,
          },
        });
      }

      // Mark as processed
      await prisma.inboundEvent.update({
        where: { id: eventId },
        data: {
          status: InboundEventStatus.PROCESSED,
          processedAt: new Date(),
        },
      });

      logger.info('Inbound event processed', { eventId });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      await prisma.inboundEvent.update({
        where: { id: eventId },
        data: {
          status: InboundEventStatus.ERROR,
          errorMessage: message,
        },
      });

      throw error;
    }
  }
);

// ============================================================================
// Integration Outbound Action Handler
// ============================================================================

interface ExecuteOutboundActionJobData {
  actionId: string;
  integrationId: string;
}

registerHandler<ExecuteOutboundActionJobData>(
  JobTypes.EXECUTE_OUTBOUND_ACTION,
  async (job) => {
    const { actionId } = job.data;

    logger.debug('Executing outbound action', { actionId });

    const { prisma } = await import('../lib/prisma.js');
    const {
      OutboundActionStatus,
      IntegrationType,
    } = await import('@prisma/client');

    const action = await prisma.outboundAction.findUnique({
      where: { id: actionId },
      include: {
        integration: {
          include: {
            connections: {
              where: { status: 'CONNECTED' },
              take: 1,
            },
          },
        },
        recommendation: true,
        csatResponse: true,
      },
    });

    if (!action) {
      logger.error('Outbound action not found', { actionId });
      return;
    }

    if (action.status === OutboundActionStatus.SUCCESS) {
      logger.debug('Outbound action already completed', { actionId });
      return;
    }

    const connection = action.integration.connections[0];
    if (!connection) {
      await prisma.outboundAction.update({
        where: { id: actionId },
        data: {
          status: OutboundActionStatus.FAILED,
          errorMessage: 'No connected integration found',
        },
      });
      return;
    }

    try {
      // Update attempt count
      await prisma.outboundAction.update({
        where: { id: actionId },
        data: {
          attemptCount: { increment: 1 },
          lastAttemptAt: new Date(),
          status: OutboundActionStatus.RETRYING,
        },
      });

      // Execute based on integration type
      let externalItemId: string | null = null;

      switch (action.integration.type) {
        case IntegrationType.JIRA:
          externalItemId = await executeJiraAction(action, connection);
          break;

        case IntegrationType.ASANA:
          externalItemId = await executeAsanaAction(action, connection);
          break;

        case IntegrationType.MONDAY:
          externalItemId = await executeMondayAction(action, connection);
          break;

        case IntegrationType.AIRTABLE:
          externalItemId = await executeAirtableAction(action, connection);
          break;

        case IntegrationType.WRIKE:
          externalItemId = await executeWrikeAction(action, connection);
          break;

        default:
          throw new Error(`Unsupported integration type: ${action.integration.type}`);
      }

      // Mark as success
      await prisma.outboundAction.update({
        where: { id: actionId },
        data: {
          status: OutboundActionStatus.SUCCESS,
          externalItemId,
          completedAt: new Date(),
        },
      });

      logger.info('Outbound action completed', { actionId, externalItemId });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      await prisma.outboundAction.update({
        where: { id: actionId },
        data: {
          status: OutboundActionStatus.FAILED,
          errorMessage: message,
        },
      });

      throw error;
    }
  }
);

// ============================================================================
// Integration Action Executors
// ============================================================================

async function executeJiraAction(
  action: { payloadJson: unknown; actionType: string },
  connection: { configJson: unknown; accessTokenEncrypted: string | null }
): Promise<string> {
  // Jira API integration
  const { decrypt } = await import('../lib/crypto.js');

  if (!connection.accessTokenEncrypted) {
    throw new Error('No access token configured');
  }

  const accessToken = decrypt(connection.accessTokenEncrypted);
  const config = connection.configJson as { cloudId?: string; projectKey?: string };
  const payload = action.payloadJson as {
    summary?: string;
    description?: string;
    issueType?: string;
    labels?: string[];
  };

  if (!config.cloudId || !config.projectKey) {
    throw new Error('Jira cloud ID or project key not configured');
  }

  const response = await fetch(
    `https://api.atlassian.com/ex/jira/${config.cloudId}/rest/api/3/issue`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project: { key: config.projectKey },
          summary: payload.summary ?? 'New issue from Q CSAT',
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: payload.description ?? '' },
                ],
              },
            ],
          },
          issuetype: { name: payload.issueType ?? 'Task' },
          labels: payload.labels ?? ['csat'],
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Jira API error: ${error}`);
  }

  const result = (await response.json()) as { key: string };
  return result.key;
}

async function executeAsanaAction(
  action: { payloadJson: unknown; actionType: string },
  connection: { configJson: unknown; accessTokenEncrypted: string | null }
): Promise<string> {
  const { decrypt } = await import('../lib/crypto.js');

  if (!connection.accessTokenEncrypted) {
    throw new Error('No access token configured');
  }

  const accessToken = decrypt(connection.accessTokenEncrypted);
  const config = connection.configJson as { projectId?: string };
  const payload = action.payloadJson as { name?: string; notes?: string };

  if (!config.projectId) {
    throw new Error('Asana project ID not configured');
  }

  const response = await fetch('https://app.asana.com/api/1.0/tasks', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        projects: [config.projectId],
        name: payload.name ?? 'New task from Q CSAT',
        notes: payload.notes ?? '',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Asana API error: ${error}`);
  }

  const result = (await response.json()) as { data: { gid: string } };
  return result.data.gid;
}

async function executeMondayAction(
  action: { payloadJson: unknown; actionType: string },
  connection: { configJson: unknown; accessTokenEncrypted: string | null }
): Promise<string> {
  const { decrypt } = await import('../lib/crypto.js');

  if (!connection.accessTokenEncrypted) {
    throw new Error('No API token configured');
  }

  const apiToken = decrypt(connection.accessTokenEncrypted);
  const config = connection.configJson as { boardId?: string };
  const payload = action.payloadJson as { itemName?: string };

  if (!config.boardId) {
    throw new Error('Monday board ID not configured');
  }

  const query = `
    mutation {
      create_item (
        board_id: ${config.boardId},
        item_name: "${payload.itemName ?? 'New item from Q CSAT'}"
      ) {
        id
      }
    }
  `;

  const response = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: {
      Authorization: apiToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Monday API error: ${error}`);
  }

  const result = (await response.json()) as { data: { create_item: { id: string } } };
  return result.data.create_item.id;
}

async function executeAirtableAction(
  action: { payloadJson: unknown; actionType: string },
  connection: { configJson: unknown; accessTokenEncrypted: string | null }
): Promise<string> {
  const { decrypt } = await import('../lib/crypto.js');

  if (!connection.accessTokenEncrypted) {
    throw new Error('No API token configured');
  }

  const apiToken = decrypt(connection.accessTokenEncrypted);
  const config = connection.configJson as { baseId?: string; tableId?: string };
  const payload = action.payloadJson as { fields?: Record<string, unknown> };

  if (!config.baseId || !config.tableId) {
    throw new Error('Airtable base or table ID not configured');
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${config.baseId}/${config.tableId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: payload.fields ?? { Name: 'New record from Q CSAT' },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${error}`);
  }

  const result = (await response.json()) as { id: string };
  return result.id;
}

async function executeWrikeAction(
  action: { payloadJson: unknown; actionType: string },
  connection: { configJson: unknown; accessTokenEncrypted: string | null }
): Promise<string> {
  const { decrypt } = await import('../lib/crypto.js');

  if (!connection.accessTokenEncrypted) {
    throw new Error('No access token configured');
  }

  const accessToken = decrypt(connection.accessTokenEncrypted);
  const config = connection.configJson as { folderId?: string };
  const payload = action.payloadJson as { title?: string; description?: string };

  if (!config.folderId) {
    throw new Error('Wrike folder ID not configured');
  }

  const response = await fetch(
    `https://www.wrike.com/api/v4/folders/${config.folderId}/tasks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: payload.title ?? 'New task from Q CSAT',
        description: payload.description ?? '',
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Wrike API error: ${error}`);
  }

  const result = (await response.json()) as { data: Array<{ id: string }> };
  return result.data[0]?.id ?? '';
}

// ============================================================================
// CSAT Aggregation Job Handler
// ============================================================================

interface ComputeAggregatesJobData {
  projectId: string;
  date: string; // ISO date string
}

registerHandler<ComputeAggregatesJobData>(
  JobTypes.COMPUTE_AGGREGATES,
  async (job) => {
    const { projectId, date } = job.data;

    logger.debug('Computing CSAT aggregates', { projectId, date });

    const { prisma } = await import('../lib/prisma.js');

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get all responses for the day
    const responses = await prisma.csatResponse.findMany({
      where: {
        projectId,
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        momentId: true,
        personaId: true,
        score: true,
      },
    });

    if (responses.length === 0) {
      logger.debug('No responses to aggregate', { projectId, date });
      return;
    }

    // Group by moment and persona
    const groups = new Map<
      string,
      { momentId: string | null; personaId: string | null; scores: number[] }
    >();

    for (const response of responses) {
      const key = `${response.momentId ?? 'null'}:${response.personaId ?? 'null'}`;
      const existing = groups.get(key) ?? {
        momentId: response.momentId,
        personaId: response.personaId,
        scores: [],
      };
      existing.scores.push(response.score);
      groups.set(key, existing);
    }

    // Compute and upsert aggregates
    for (const group of groups.values()) {
      const scores = group.scores.sort((a, b) => a - b);
      const count = scores.length;
      const avg = scores.reduce((a, b) => a + b, 0) / count;
      const min = scores[0];
      const max = scores[count - 1];
      const p50Index = Math.floor(count * 0.5);
      const p90Index = Math.floor(count * 0.9);

      const promoters = scores.filter((s) => s >= 4).length;
      const passives = scores.filter((s) => s === 3).length;
      const detractors = scores.filter((s) => s <= 2).length;

      await prisma.csatAggregate.upsert({
        where: {
          projectId_momentId_personaId_timeBucket_granularity: {
            projectId,
            momentId: group.momentId,
            personaId: group.personaId,
            timeBucket: startDate,
            granularity: 'daily',
          },
        },
        update: {
          responsesCount: count,
          avgScore: avg,
          minScore: min,
          maxScore: max,
          p50Score: scores[p50Index],
          p90Score: scores[p90Index],
          promoters,
          passives,
          detractors,
        },
        create: {
          projectId,
          momentId: group.momentId,
          personaId: group.personaId,
          timeBucket: startDate,
          granularity: 'daily',
          responsesCount: count,
          avgScore: avg,
          minScore: min,
          maxScore: max,
          p50Score: scores[p50Index],
          p90Score: scores[p90Index],
          promoters,
          passives,
          detractors,
        },
      });
    }

    logger.info('CSAT aggregates computed', {
      projectId,
      date,
      groupCount: groups.size,
    });
  }
);

// Export for external initialization
export function initializeJobHandlers(): void {
  logger.info('Job handlers initialized');
}
