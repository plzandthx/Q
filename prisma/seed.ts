/**
 * Database Seed Script
 * Seeds the database with initial data for development/testing
 */

import { PrismaClient, OrgRole, AuthProvider, ProjectStatus, WidgetType, IntegrationType, IntegrationDirection } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // Plans
  // ============================================================================
  console.log('Creating plans...');

  const freePlan = await prisma.plan.upsert({
    where: { slug: 'free' },
    update: {},
    create: {
      name: 'Free',
      slug: 'free',
      description: 'Get started with CSAT collection',
      monthlyPriceCents: 0,
      annualPriceCents: 0,
      projectsLimit: 1,
      usersLimit: 2,
      integrationsLimit: 2,
      widgetsLimit: 3,
      responsesPerMonth: 100,
      featuresJson: {
        basicDashboard: true,
        emailSupport: true,
      },
      sortOrder: 0,
    },
  });

  const growthPlan = await prisma.plan.upsert({
    where: { slug: 'growth' },
    update: {},
    create: {
      name: 'Growth',
      slug: 'growth',
      description: 'For growing teams',
      monthlyPriceCents: 4900, // $49/month
      annualPriceCents: 47000, // $470/year (~20% discount)
      projectsLimit: 5,
      usersLimit: 10,
      integrationsLimit: 10,
      widgetsLimit: 20,
      responsesPerMonth: 5000,
      featuresJson: {
        basicDashboard: true,
        advancedAnalytics: true,
        emailSupport: true,
        prioritySupport: true,
        customBranding: true,
      },
      sortOrder: 1,
    },
  });

  const scalePlan = await prisma.plan.upsert({
    where: { slug: 'scale' },
    update: {},
    create: {
      name: 'Scale',
      slug: 'scale',
      description: 'For larger organizations',
      monthlyPriceCents: 14900, // $149/month
      annualPriceCents: 143000, // $1430/year (~20% discount)
      projectsLimit: 50,
      usersLimit: 100,
      integrationsLimit: -1, // Unlimited
      widgetsLimit: -1, // Unlimited
      responsesPerMonth: -1, // Unlimited
      featuresJson: {
        basicDashboard: true,
        advancedAnalytics: true,
        emailSupport: true,
        prioritySupport: true,
        customBranding: true,
        sso: true,
        apiAccess: true,
        dedicatedSupport: true,
      },
      sortOrder: 2,
    },
  });

  console.log(`✅ Created plans: ${freePlan.name}, ${growthPlan.name}, ${scalePlan.name}`);

  // ============================================================================
  // Demo User & Organization
  // ============================================================================
  console.log('Creating demo user and organization...');

  const passwordHash = await argon2.hash('Demo1234!', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      authProvider: AuthProvider.PASSWORD,
      passwordHash,
      emailVerified: true,
    },
  });

  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Demo Company',
      slug: 'demo-company',
    },
  });

  await prisma.orgMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: demoOrg.id,
        userId: demoUser.id,
      },
    },
    update: {},
    create: {
      organizationId: demoOrg.id,
      userId: demoUser.id,
      role: OrgRole.OWNER,
    },
  });

  await prisma.subscription.upsert({
    where: {
      id: `sub-${demoOrg.id}`,
    },
    update: {},
    create: {
      id: `sub-${demoOrg.id}`,
      organizationId: demoOrg.id,
      planId: growthPlan.id,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email}`);
  console.log(`✅ Created demo organization: ${demoOrg.name}`);

  // ============================================================================
  // Demo Project: Plantasia
  // ============================================================================
  console.log('Creating demo project...');

  const plantasiaProject = await prisma.project.upsert({
    where: { id: 'plantasia-demo-project' },
    update: {},
    create: {
      id: 'plantasia-demo-project',
      organizationId: demoOrg.id,
      name: 'Plantasia Nursery Co.',
      description: 'Demo project for a plant nursery e-commerce site',
      status: ProjectStatus.ACTIVE,
      createdByUserId: demoUser.id,
    },
  });

  // Personas
  const personas = [
    {
      id: 'persona-affluent',
      name: 'Affluent Plant Enthusiast',
      description: 'High-income customers passionate about rare and premium plants',
      attributes: { segment: 'premium', avgOrderValue: 250 },
    },
    {
      id: 'persona-casual',
      name: 'Casual Shopper',
      description: 'First-time or occasional buyers looking for easy-care plants',
      attributes: { segment: 'casual', avgOrderValue: 35 },
    },
    {
      id: 'persona-gift',
      name: 'Gift Buyer',
      description: 'Customers purchasing plants as gifts for others',
      attributes: { segment: 'gift', avgOrderValue: 60 },
    },
  ];

  for (const persona of personas) {
    await prisma.persona.upsert({
      where: { id: persona.id },
      update: {},
      create: {
        id: persona.id,
        projectId: plantasiaProject.id,
        name: persona.name,
        description: persona.description,
        attributes: persona.attributes,
      },
    });
  }

  console.log(`✅ Created ${personas.length} personas`);

  // Moments
  const moments = [
    { id: 'moment-discovery', name: 'Plant Discovery', description: 'Browsing and discovering plants', iconEmoji: '🔍', orderIndex: 0 },
    { id: 'moment-checkout', name: 'Checkout Experience', description: 'Adding to cart and completing purchase', iconEmoji: '🛒', orderIndex: 1 },
    { id: 'moment-delivery', name: 'Delivery Experience', description: 'Receiving the order', iconEmoji: '📦', orderIndex: 2 },
    { id: 'moment-care', name: 'Plant Care Support', description: 'Getting help with plant care', iconEmoji: '🌱', orderIndex: 3 },
    { id: 'moment-support', name: 'Customer Support', description: 'Interacting with support team', iconEmoji: '💬', orderIndex: 4 },
  ];

  for (const moment of moments) {
    await prisma.moment.upsert({
      where: { id: moment.id },
      update: {},
      create: {
        id: moment.id,
        projectId: plantasiaProject.id,
        name: moment.name,
        description: moment.description,
        iconEmoji: moment.iconEmoji,
        orderIndex: moment.orderIndex,
      },
    });
  }

  console.log(`✅ Created ${moments.length} moments`);

  // Widgets
  const widgets = [
    {
      id: 'widget-post-purchase',
      name: 'Post-Purchase Survey',
      type: WidgetType.MODAL_CAPTURE,
      publicKey: 'qw_demo_postpurchase',
      config: {
        theme: { primaryColor: '#22c55e' },
        questions: { scoreLabel: 'How was your checkout experience?', scoreType: '1-5' },
        copy: { title: 'Quick Feedback', thankYouMessage: 'Thanks for your feedback!' },
      },
    },
    {
      id: 'widget-delivery',
      name: 'Delivery Feedback',
      type: WidgetType.TOAST,
      publicKey: 'qw_demo_delivery',
      config: {
        theme: { primaryColor: '#22c55e' },
        questions: { scoreLabel: 'How was your delivery?', scoreType: '1-5' },
        behavior: { position: 'bottom-right' },
      },
    },
    {
      id: 'widget-support',
      name: 'Support Rating',
      type: WidgetType.INLINE_EMBED,
      publicKey: 'qw_demo_support',
      config: {
        theme: { primaryColor: '#22c55e' },
        questions: { scoreLabel: 'Rate your support experience', commentRequired: false },
      },
    },
  ];

  for (const widget of widgets) {
    await prisma.csatWidget.upsert({
      where: { id: widget.id },
      update: {},
      create: {
        id: widget.id,
        projectId: plantasiaProject.id,
        name: widget.name,
        type: widget.type,
        publicKey: widget.publicKey,
        configJson: widget.config,
        isActive: true,
      },
    });
  }

  console.log(`✅ Created ${widgets.length} widgets`);

  // Sample CSAT Responses
  console.log('Creating sample CSAT responses...');

  const sampleResponses = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const momentIndex = Math.floor(Math.random() * moments.length);
    const personaIndex = Math.floor(Math.random() * personas.length);
    const score = Math.floor(Math.random() * 3) + 3; // 3-5 score range

    sampleResponses.push({
      projectId: plantasiaProject.id,
      momentId: moments[momentIndex].id,
      personaId: personas[personaIndex].id,
      widgetId: widgets[0].id,
      score,
      comment: score >= 4 ? 'Great experience!' : score === 3 ? 'Could be better' : null,
      metadataJson: {},
      createdAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
    });
  }

  await prisma.csatResponse.createMany({
    data: sampleResponses,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${sampleResponses.length} sample CSAT responses`);

  // Demo Integrations
  console.log('Creating demo integrations...');

  const integrations = [
    {
      id: 'int-zendesk',
      type: IntegrationType.ZENDESK,
      direction: IntegrationDirection.INBOUND,
      displayName: 'Zendesk Support',
      description: 'Import satisfaction ratings from Zendesk tickets',
    },
    {
      id: 'int-jira',
      type: IntegrationType.JIRA,
      direction: IntegrationDirection.OUTBOUND,
      displayName: 'Jira Product Board',
      description: 'Create issues from recommendations',
    },
  ];

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: { id: integration.id },
      update: {},
      create: {
        id: integration.id,
        organizationId: demoOrg.id,
        type: integration.type,
        direction: integration.direction,
        displayName: integration.displayName,
        description: integration.description,
        isEnabled: true,
      },
    });
  }

  console.log(`✅ Created ${integrations.length} demo integrations`);

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email: demo@example.com');
  console.log('  Password: Demo1234!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
