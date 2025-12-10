'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from './client';
import type { Tables } from './database.types';
import { useAuth } from './auth-context';

// Generic hook for fetching data from Supabase
export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: Error | null }>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await queryFn();
    setData(result.data);
    setError(result.error);
    setIsLoading(false);
  }, [queryFn]);

  useEffect(() => {
    refetch();
  }, deps);

  return { data, isLoading, error, refetch };
}

// Hook for fetching projects
export function useProjects(organizationId?: string) {
  const supabase = createClient();
  const { currentOrganization } = useAuth();
  const orgId = organizationId || currentOrganization?.id;

  return useSupabaseQuery<Tables<'projects'>[]>(
    async () => {
      if (!orgId) return { data: [], error: null };
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', orgId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      return { data: data || [], error: error as Error | null };
    },
    [orgId]
  );
}

// Hook for fetching a single project
export function useProject(projectId: string) {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'projects'>>(
    async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      return { data, error: error as Error | null };
    },
    [projectId]
  );
}

// Hook for fetching project personas
export function usePersonas(projectId: string) {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'personas'>[]>(
    async () => {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('project_id', projectId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      return { data: data || [], error: error as Error | null };
    },
    [projectId]
  );
}

// Hook for fetching project moments
export function useMoments(projectId: string) {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'moments'>[]>(
    async () => {
      const { data, error } = await supabase
        .from('moments')
        .select('*')
        .eq('project_id', projectId)
        .is('deleted_at', null)
        .order('order_index', { ascending: true });
      return { data: data || [], error: error as Error | null };
    },
    [projectId]
  );
}

// Hook for fetching CSAT responses
export function useCsatResponses(projectId: string, limit = 100) {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'csat_responses'>[]>(
    async () => {
      const { data, error } = await supabase
        .from('csat_responses')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);
      return { data: data || [], error: error as Error | null };
    },
    [projectId, limit]
  );
}

// Hook for fetching CSAT aggregates
export function useCsatAggregates(
  projectId: string,
  granularity: 'daily' | 'weekly' | 'monthly' = 'daily',
  days = 30
) {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'csat_aggregates'>[]>(
    async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('csat_aggregates')
        .select('*')
        .eq('project_id', projectId)
        .eq('granularity', granularity)
        .gte('time_bucket', startDate.toISOString().split('T')[0])
        .order('time_bucket', { ascending: true });
      return { data: data || [], error: error as Error | null };
    },
    [projectId, granularity, days]
  );
}

// Hook for fetching alerts
export function useAlerts(projectId: string, unreadOnly = false) {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'alerts'>[]>(
    async () => {
      let query = supabase
        .from('alerts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query.limit(50);
      return { data: data || [], error: error as Error | null };
    },
    [projectId, unreadOnly]
  );
}

// Hook for fetching recommendations
export function useRecommendations(projectId: string, status?: string) {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'recommendations'>[]>(
    async () => {
      let query = supabase
        .from('recommendations')
        .select('*')
        .eq('project_id', projectId)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      return { data: data || [], error: error as Error | null };
    },
    [projectId, status]
  );
}

// Hook for fetching widgets
export function useWidgets(projectId: string) {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'csat_widgets'>[]>(
    async () => {
      const { data, error } = await supabase
        .from('csat_widgets')
        .select('*')
        .eq('project_id', projectId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      return { data: data || [], error: error as Error | null };
    },
    [projectId]
  );
}

// Hook for fetching integrations
export function useIntegrations(organizationId?: string) {
  const supabase = createClient();
  const { currentOrganization } = useAuth();
  const orgId = organizationId || currentOrganization?.id;

  return useSupabaseQuery<Tables<'integrations'>[]>(
    async () => {
      if (!orgId) return { data: [], error: null };
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('organization_id', orgId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      return { data: data || [], error: error as Error | null };
    },
    [orgId]
  );
}

// Hook for fetching plans
export function usePlans() {
  const supabase = createClient();

  return useSupabaseQuery<Tables<'plans'>[]>(
    async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      return { data: data || [], error: error as Error | null };
    },
    []
  );
}

// Hook for fetching organization subscription
export function useSubscription(organizationId?: string) {
  const supabase = createClient();
  const { currentOrganization } = useAuth();
  const orgId = organizationId || currentOrganization?.id;

  return useSupabaseQuery<Tables<'subscriptions'> & { plans: Tables<'plans'> }>(
    async () => {
      if (!orgId) return { data: null, error: null };
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .eq('organization_id', orgId)
        .single();
      return { data, error: error as Error | null };
    },
    [orgId]
  );
}
