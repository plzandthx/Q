// Database types generated from Prisma schema
// These types match your Supabase PostgreSQL database structure

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          auth_provider: 'PASSWORD' | 'GOOGLE' | 'SSO_FUTURE';
          email_verified: boolean;
          mfa_enabled: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          auth_provider?: 'PASSWORD' | 'GOOGLE' | 'SSO_FUTURE';
          email_verified?: boolean;
          mfa_enabled?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          auth_provider?: 'PASSWORD' | 'GOOGLE' | 'SSO_FUTURE';
          email_verified?: boolean;
          mfa_enabled?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      org_memberships: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          status: 'ACTIVE' | 'ARCHIVED';
          icon_url: string | null;
          created_by_user_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          status?: 'ACTIVE' | 'ARCHIVED';
          icon_url?: string | null;
          created_by_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string | null;
          status?: 'ACTIVE' | 'ARCHIVED';
          icon_url?: string | null;
          created_by_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      personas: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          avatar_url: string | null;
          attributes: Json;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          avatar_url?: string | null;
          attributes?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          avatar_url?: string | null;
          attributes?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      moments: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          order_index: number;
          icon_emoji: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          order_index?: number;
          icon_emoji?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          description?: string | null;
          order_index?: number;
          icon_emoji?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      csat_widgets: {
        Row: {
          id: string;
          project_id: string;
          type: 'MODAL_CAPTURE' | 'TOAST' | 'INLINE_EMBED';
          name: string;
          public_key: string;
          config_json: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          type: 'MODAL_CAPTURE' | 'TOAST' | 'INLINE_EMBED';
          name: string;
          public_key: string;
          config_json?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          type?: 'MODAL_CAPTURE' | 'TOAST' | 'INLINE_EMBED';
          name?: string;
          public_key?: string;
          config_json?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      csat_responses: {
        Row: {
          id: string;
          project_id: string;
          moment_id: string | null;
          persona_id: string | null;
          widget_id: string | null;
          integration_id: string | null;
          inbound_event_id: string | null;
          external_reference: string | null;
          score: number;
          comment: string | null;
          metadata_json: Json;
          respondent_identifier_hash: string | null;
          source_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          moment_id?: string | null;
          persona_id?: string | null;
          widget_id?: string | null;
          integration_id?: string | null;
          inbound_event_id?: string | null;
          external_reference?: string | null;
          score: number;
          comment?: string | null;
          metadata_json?: Json;
          respondent_identifier_hash?: string | null;
          source_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          moment_id?: string | null;
          persona_id?: string | null;
          widget_id?: string | null;
          integration_id?: string | null;
          inbound_event_id?: string | null;
          external_reference?: string | null;
          score?: number;
          comment?: string | null;
          metadata_json?: Json;
          respondent_identifier_hash?: string | null;
          source_type?: string;
          created_at?: string;
        };
      };
      csat_aggregates: {
        Row: {
          id: string;
          project_id: string;
          moment_id: string | null;
          persona_id: string | null;
          time_bucket: string;
          granularity: string;
          responses_count: number;
          avg_score: number;
          min_score: number;
          max_score: number;
          p50_score: number;
          p90_score: number;
          promoters: number;
          passives: number;
          detractors: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          moment_id?: string | null;
          persona_id?: string | null;
          time_bucket: string;
          granularity?: string;
          responses_count: number;
          avg_score: number;
          min_score: number;
          max_score: number;
          p50_score: number;
          p90_score: number;
          promoters?: number;
          passives?: number;
          detractors?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          moment_id?: string | null;
          persona_id?: string | null;
          time_bucket?: string;
          granularity?: string;
          responses_count?: number;
          avg_score?: number;
          min_score?: number;
          max_score?: number;
          p50_score?: number;
          p90_score?: number;
          promoters?: number;
          passives?: number;
          detractors?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          organization_id: string;
          type: string;
          direction: 'INBOUND' | 'OUTBOUND' | 'BOTH';
          display_name: string;
          description: string | null;
          icon_url: string | null;
          is_enabled: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          type: string;
          direction: 'INBOUND' | 'OUTBOUND' | 'BOTH';
          display_name: string;
          description?: string | null;
          icon_url?: string | null;
          is_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          type?: string;
          direction?: 'INBOUND' | 'OUTBOUND' | 'BOTH';
          display_name?: string;
          description?: string | null;
          icon_url?: string | null;
          is_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      recommendations: {
        Row: {
          id: string;
          project_id: string;
          moment_id: string | null;
          persona_id: string | null;
          generated_by_user_id: string | null;
          title: string;
          description: string;
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
          status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
          source: 'RULE' | 'MANUAL' | 'AI_FUTURE';
          metadata_json: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          moment_id?: string | null;
          persona_id?: string | null;
          generated_by_user_id?: string | null;
          title: string;
          description: string;
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
          status?: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
          source?: 'RULE' | 'MANUAL' | 'AI_FUTURE';
          metadata_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          moment_id?: string | null;
          persona_id?: string | null;
          generated_by_user_id?: string | null;
          title?: string;
          description?: string;
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
          status?: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
          source?: 'RULE' | 'MANUAL' | 'AI_FUTURE';
          metadata_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          project_id: string;
          moment_id: string | null;
          type: string;
          severity: 'INFO' | 'WARNING' | 'CRITICAL';
          title: string;
          message: string;
          is_read: boolean;
          metadata_json: Json;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          moment_id?: string | null;
          type: string;
          severity?: 'INFO' | 'WARNING' | 'CRITICAL';
          title: string;
          message: string;
          is_read?: boolean;
          metadata_json?: Json;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          moment_id?: string | null;
          type?: string;
          severity?: 'INFO' | 'WARNING' | 'CRITICAL';
          title?: string;
          message?: string;
          is_read?: boolean;
          metadata_json?: Json;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          monthly_price_cents: number;
          annual_price_cents: number;
          projects_limit: number;
          users_limit: number;
          integrations_limit: number;
          widgets_limit: number;
          responses_per_month: number;
          features_json: Json;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          monthly_price_cents: number;
          annual_price_cents: number;
          projects_limit: number;
          users_limit: number;
          integrations_limit: number;
          widgets_limit: number;
          responses_per_month: number;
          features_json?: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          monthly_price_cents?: number;
          annual_price_cents?: number;
          projects_limit?: number;
          users_limit?: number;
          integrations_limit?: number;
          widgets_limit?: number;
          responses_per_month?: number;
          features_json?: Json;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          plan_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
          billing_interval: 'MONTHLY' | 'ANNUAL';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          plan_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
          billing_interval?: 'MONTHLY' | 'ANNUAL';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          plan_id?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
          billing_interval?: 'MONTHLY' | 'ANNUAL';
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          trial_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      auth_provider: 'PASSWORD' | 'GOOGLE' | 'SSO_FUTURE';
      org_role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
      subscription_status: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
      billing_interval: 'MONTHLY' | 'ANNUAL';
      project_status: 'ACTIVE' | 'ARCHIVED';
      widget_type: 'MODAL_CAPTURE' | 'TOAST' | 'INLINE_EMBED';
      integration_type: 'ZENDESK' | 'GA4' | 'APP_STORE' | 'PLAY_STORE' | 'TABLEAU' | 'JIRA' | 'ASANA' | 'MONDAY' | 'AIRTABLE' | 'WRIKE';
      integration_direction: 'INBOUND' | 'OUTBOUND' | 'BOTH';
      recommendation_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      recommendation_status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
      alert_severity: 'INFO' | 'WARNING' | 'CRITICAL';
    };
  };
};

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
