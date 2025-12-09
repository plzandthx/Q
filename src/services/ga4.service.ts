/**
 * GA4 (Google Analytics 4) Integration Service
 * Handles importing events and user behavior data from GA4
 */

import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';
import { ValidationError } from '../lib/errors.js';
import { InboundEventStatus, InboundSourceType } from '@prisma/client';

// GA4 Event structure from BigQuery export or Data API
export interface GA4Event {
  event_name: string;
  event_timestamp: string;
  event_date: string;
  user_id?: string;
  user_pseudo_id: string;
  event_params: GA4EventParam[];
  user_properties?: GA4UserProperty[];
  device?: {
    category?: string;
    mobile_brand_name?: string;
    operating_system?: string;
  };
  geo?: {
    country?: string;
    region?: string;
    city?: string;
  };
  traffic_source?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

export interface GA4EventParam {
  key: string;
  value: {
    string_value?: string;
    int_value?: number;
    float_value?: number;
    double_value?: number;
  };
}

export interface GA4UserProperty {
  key: string;
  value: {
    string_value?: string;
    int_value?: number;
    set_timestamp_micros?: string;
  };
}

// Batch import request
export interface GA4ImportRequest {
  integrationId: string;
  projectId: string;
  events: GA4Event[];
  mappingConfig?: GA4MappingConfig;
}

export interface GA4MappingConfig {
  // Map event names to moments
  eventToMoment?: Record<string, string>;
  // Map user property values to personas
  userPropertyToPersona?: {
    propertyKey: string;
    valueToPersonaId: Record<string, string>;
  };
  // Score extraction configuration
  scoreExtraction?: {
    eventName: string;
    paramKey: string;
    scale?: { min: number; max: number; targetMin: number; targetMax: number };
  };
}

/**
 * Extract parameter value from GA4 event params
 */
function extractParamValue(
  params: GA4EventParam[],
  key: string
): string | number | null {
  const param = params.find((p) => p.key === key);
  if (!param) return null;

  if (param.value.string_value !== undefined) {
    return param.value.string_value;
  }
  if (param.value.int_value !== undefined) {
    return param.value.int_value;
  }
  if (param.value.float_value !== undefined) {
    return param.value.float_value;
  }
  if (param.value.double_value !== undefined) {
    return param.value.double_value;
  }
  return null;
}

/**
 * Normalize score to 1-5 scale
 */
function normalizeScore(
  value: number,
  scale?: { min: number; max: number; targetMin: number; targetMax: number }
): number {
  if (!scale) {
    // Assume already 1-5 scale
    return Math.min(5, Math.max(1, Math.round(value)));
  }

  const { min, max, targetMin, targetMax } = scale;
  const normalized = ((value - min) / (max - min)) * (targetMax - targetMin) + targetMin;
  return Math.min(5, Math.max(1, Math.round(normalized)));
}

/**
 * Parse GA4 timestamp (microseconds since epoch)
 */
function parseGA4Timestamp(timestamp: string): Date {
  const microseconds = parseInt(timestamp, 10);
  return new Date(microseconds / 1000);
}

/**
 * Process a single GA4 event
 */
async function processGA4Event(
  event: GA4Event,
  integrationId: string,
  projectId: string,
  mappingConfig?: GA4MappingConfig
): Promise<{
  eventId: string;
  csatResponseId?: string;
}> {
  // Determine moment from event name
  let momentId: string | undefined;
  if (mappingConfig?.eventToMoment?.[event.event_name]) {
    momentId = mappingConfig.eventToMoment[event.event_name];
  }

  // Determine persona from user properties
  let personaId: string | undefined;
  if (mappingConfig?.userPropertyToPersona && event.user_properties) {
    const { propertyKey, valueToPersonaId } = mappingConfig.userPropertyToPersona;
    const prop = event.user_properties.find((p) => p.key === propertyKey);
    if (prop?.value.string_value) {
      personaId = valueToPersonaId[prop.value.string_value];
    }
  }

  // Extract score if configured
  let normalizedScore: number | undefined;
  if (
    mappingConfig?.scoreExtraction &&
    event.event_name === mappingConfig.scoreExtraction.eventName
  ) {
    const scoreValue = extractParamValue(
      event.event_params,
      mappingConfig.scoreExtraction.paramKey
    );
    if (typeof scoreValue === 'number') {
      normalizedScore = normalizeScore(scoreValue, mappingConfig.scoreExtraction.scale);
    }
  }

  // Create unique external ID
  const externalId = `ga4:${event.user_pseudo_id}:${event.event_name}:${event.event_timestamp}`;

  // Check if event already processed
  const existing = await prisma.inboundEvent.findFirst({
    where: { integrationId, externalId },
  });

  if (existing) {
    return { eventId: existing.id, csatResponseId: undefined };
  }

  // Create inbound event
  const inboundEvent = await prisma.inboundEvent.create({
    data: {
      integrationId,
      projectId,
      momentId,
      externalId,
      sourceType: InboundSourceType.GA4_EVENT,
      payloadJson: event as unknown as Record<string, unknown>,
      normalizedScore,
      status: normalizedScore !== undefined
        ? InboundEventStatus.PROCESSED
        : InboundEventStatus.RECEIVED,
      processedAt: normalizedScore !== undefined ? new Date() : undefined,
    },
  });

  // Create CSAT response if we have a score
  let csatResponseId: string | undefined;
  if (normalizedScore !== undefined) {
    const csatResponse = await prisma.csatResponse.create({
      data: {
        projectId,
        momentId,
        personaId,
        integrationId,
        inboundEventId: inboundEvent.id,
        externalReference: externalId,
        score: normalizedScore,
        sourceType: InboundSourceType.GA4_EVENT,
        metadataJson: {
          eventName: event.event_name,
          userId: event.user_id,
          userPseudoId: event.user_pseudo_id,
          device: event.device,
          geo: event.geo,
          trafficSource: event.traffic_source,
        },
      },
    });
    csatResponseId = csatResponse.id;
  }

  return { eventId: inboundEvent.id, csatResponseId };
}

/**
 * Import GA4 events in batch
 */
export async function importGA4Events(
  request: GA4ImportRequest
): Promise<{
  processed: number;
  skipped: number;
  csatResponsesCreated: number;
  errors: Array<{ index: number; error: string }>;
}> {
  const { integrationId, projectId, events, mappingConfig } = request;

  let processed = 0;
  let skipped = 0;
  let csatResponsesCreated = 0;
  const errors: Array<{ index: number; error: string }> = [];

  logger.info('Starting GA4 import', {
    integrationId,
    projectId,
    eventCount: events.length,
  });

  for (let i = 0; i < events.length; i++) {
    try {
      const event = events[i];

      // Skip invalid events
      if (!event.event_name || !event.event_timestamp) {
        skipped++;
        continue;
      }

      const result = await processGA4Event(event, integrationId, projectId, mappingConfig);

      if (result.csatResponseId) {
        csatResponsesCreated++;
      }

      processed++;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ index: i, error: message });
      logger.error('GA4 event processing error', {
        integrationId,
        index: i,
        error: message,
      });
    }
  }

  logger.info('GA4 import completed', {
    integrationId,
    projectId,
    processed,
    skipped,
    csatResponsesCreated,
    errorCount: errors.length,
  });

  return { processed, skipped, csatResponsesCreated, errors };
}

/**
 * Parse GA4 BigQuery export format
 * GA4 exports to BigQuery have a specific nested structure
 */
export function parseGA4BigQueryExport(rows: Record<string, unknown>[]): GA4Event[] {
  return rows.map((row) => ({
    event_name: row.event_name as string,
    event_timestamp: row.event_timestamp as string,
    event_date: row.event_date as string,
    user_id: row.user_id as string | undefined,
    user_pseudo_id: row.user_pseudo_id as string,
    event_params: (row.event_params as GA4EventParam[]) || [],
    user_properties: (row.user_properties as GA4UserProperty[]) || [],
    device: row.device as GA4Event['device'],
    geo: row.geo as GA4Event['geo'],
    traffic_source: row.traffic_source as GA4Event['traffic_source'],
  }));
}

/**
 * Create default mapping config for common satisfaction events
 */
export function createDefaultMappingConfig(): GA4MappingConfig {
  return {
    scoreExtraction: {
      eventName: 'satisfaction_rating',
      paramKey: 'rating',
      scale: { min: 1, max: 5, targetMin: 1, targetMax: 5 },
    },
  };
}
