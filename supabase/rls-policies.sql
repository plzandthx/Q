-- Row Level Security Policies for Q CSAT Dashboard
-- Run this in your Supabase SQL Editor after creating the tables

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE csat_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USERS TABLE POLICIES
-- =============================================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Allow insert for new user signup (via auth trigger)
CREATE POLICY "Enable insert for authenticated users"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- ORGANIZATIONS TABLE POLICIES
-- =============================================================================

-- Users can view organizations they belong to
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = organizations.id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- Org owners/admins can update organization
CREATE POLICY "Org admins can update organization"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = organizations.id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN')
    )
  );

-- Authenticated users can create organizations
CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================================================
-- ORG_MEMBERSHIPS TABLE POLICIES
-- =============================================================================

-- Users can view memberships for their organizations
CREATE POLICY "Users can view org memberships"
  ON org_memberships FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM org_memberships AS om
      WHERE om.organization_id = org_memberships.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Org owners/admins can manage memberships
CREATE POLICY "Org admins can manage memberships"
  ON org_memberships FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = NEW.organization_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN')
    )
    OR auth.uid() = user_id -- Allow self-insert when creating org
  );

CREATE POLICY "Org admins can update memberships"
  ON org_memberships FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships AS om
      WHERE om.organization_id = org_memberships.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('OWNER', 'ADMIN')
    )
  );

CREATE POLICY "Org admins can delete memberships"
  ON org_memberships FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships AS om
      WHERE om.organization_id = org_memberships.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('OWNER', 'ADMIN')
    )
  );

-- =============================================================================
-- PROJECTS TABLE POLICIES
-- =============================================================================

-- Users can view projects in their organizations
CREATE POLICY "Users can view org projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = projects.organization_id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- Org members can create projects
CREATE POLICY "Org members can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = projects.organization_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- Org members can update projects
CREATE POLICY "Org members can update projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = projects.organization_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- =============================================================================
-- PERSONAS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view project personas"
  ON personas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = personas.project_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can manage personas"
  ON personas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = personas.project_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- =============================================================================
-- MOMENTS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view project moments"
  ON moments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = moments.project_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can manage moments"
  ON moments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = moments.project_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- =============================================================================
-- CSAT_WIDGETS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view project widgets"
  ON csat_widgets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = csat_widgets.project_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can manage widgets"
  ON csat_widgets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = csat_widgets.project_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- Public access to widgets for submissions (via public_key)
CREATE POLICY "Public can access active widgets by public_key"
  ON csat_widgets FOR SELECT
  USING (is_active = true);

-- =============================================================================
-- CSAT_RESPONSES TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view project responses"
  ON csat_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = csat_responses.project_id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- Public can submit responses (anonymous)
CREATE POLICY "Public can submit responses"
  ON csat_responses FOR INSERT
  WITH CHECK (true);

-- =============================================================================
-- CSAT_AGGREGATES TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view project aggregates"
  ON csat_aggregates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = csat_aggregates.project_id
      AND org_memberships.user_id = auth.uid()
    )
  );

-- =============================================================================
-- INTEGRATIONS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view org integrations"
  ON integrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = integrations.organization_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Org admins can manage integrations"
  ON integrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = integrations.organization_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN')
    )
  );

-- =============================================================================
-- RECOMMENDATIONS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view project recommendations"
  ON recommendations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = recommendations.project_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can manage recommendations"
  ON recommendations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = recommendations.project_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- =============================================================================
-- ALERTS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view project alerts"
  ON alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = alerts.project_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Org members can manage alerts"
  ON alerts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      JOIN org_memberships ON org_memberships.organization_id = projects.organization_id
      WHERE projects.id = alerts.project_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- =============================================================================
-- PLANS TABLE POLICIES (Public read)
-- =============================================================================

CREATE POLICY "Anyone can view active plans"
  ON plans FOR SELECT
  USING (is_active = true);

-- =============================================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- =============================================================================

CREATE POLICY "Users can view org subscriptions"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = subscriptions.organization_id
      AND org_memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "Org owners can manage subscriptions"
  ON subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM org_memberships
      WHERE org_memberships.organization_id = subscriptions.organization_id
      AND org_memberships.user_id = auth.uid()
      AND org_memberships.role = 'OWNER'
    )
  );
