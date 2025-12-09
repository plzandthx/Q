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
      monthlyPriceCents: 4900,
      annualPriceCents: 47000,
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
      monthlyPriceCents: 14900,
      annualPriceCents: 143000,
      projectsLimit: 50,
      usersLimit: 100,
      integrationsLimit: -1,
      widgetsLimit: -1,
      responsesPerMonth: -1,
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

  // Create or find membership
  const existingMembership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: demoOrg.id,
        userId: demoUser.id,
      },
    },
  });

  if (!existingMembership) {
    await prisma.orgMembership.create({
      data: {
        organizationId: demoOrg.id,
        userId: demoUser.id,
        role: OrgRole.OWNER,
      },
    });
  }

  // Create subscription
  const existingSubscription = await prisma.subscription.findFirst({
    where: { organizationId: demoOrg.id },
  });

  if (!existingSubscription) {
    await prisma.subscription.create({
      data: {
        organizationId: demoOrg.id,
        planId: growthPlan.id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Created demo user: ${demoUser.email}`);
  console.log(`✅ Created demo organization: ${demoOrg.name}`);

  // ============================================================================
  // Demo Project: Plantasia
  // ============================================================================
  console.log('Creating demo project...');

  // Find or create project by name within org
  let plantasiaProject = await prisma.project.findFirst({
    where: {
      organizationId: demoOrg.id,
      name: 'Plantasia Nursery Co.',
    },
  });

  if (!plantasiaProject) {
    plantasiaProject = await prisma.project.create({
      data: {
        organizationId: demoOrg.id,
        name: 'Plantasia Nursery Co.',
        description: 'Demo project for a plant nursery e-commerce site',
        status: ProjectStatus.ACTIVE,
        createdByUserId: demoUser.id,
      },
    });
  }

  // Personas
  const personaData = [
    {
      name: 'Affluent Plant Enthusiast',
      description: 'High-income customers passionate about rare and premium plants',
      attributes: { segment: 'premium', avgOrderValue: 250 },
    },
    {
      name: 'Casual Shopper',
      description: 'First-time or occasional buyers looking for easy-care plants',
      attributes: { segment: 'casual', avgOrderValue: 35 },
    },
    {
      name: 'Gift Buyer',
      description: 'Customers purchasing plants as gifts for others',
      attributes: { segment: 'gift', avgOrderValue: 60 },
    },
  ];

  const createdPersonas = [];
  for (const p of personaData) {
    let persona = await prisma.persona.findFirst({
      where: { projectId: plantasiaProject.id, name: p.name },
    });
    if (!persona) {
      persona = await prisma.persona.create({
        data: {
          projectId: plantasiaProject.id,
          name: p.name,
          description: p.description,
          attributes: p.attributes,
        },
      });
    }
    createdPersonas.push(persona);
  }

  console.log(`✅ Created ${createdPersonas.length} personas`);

  // Moments
  const momentData = [
    { name: 'Plant Discovery', description: 'Browsing and discovering plants', iconEmoji: '🔍', orderIndex: 0 },
    { name: 'Checkout Experience', description: 'Adding to cart and completing purchase', iconEmoji: '🛒', orderIndex: 1 },
    { name: 'Delivery Experience', description: 'Receiving the order', iconEmoji: '📦', orderIndex: 2 },
    { name: 'Plant Care Support', description: 'Getting help with plant care', iconEmoji: '🌱', orderIndex: 3 },
    { name: 'Customer Support', description: 'Interacting with support team', iconEmoji: '💬', orderIndex: 4 },
  ];

  const createdMoments = [];
  for (const m of momentData) {
    let moment = await prisma.moment.findFirst({
      where: { projectId: plantasiaProject.id, name: m.name },
    });
    if (!moment) {
      moment = await prisma.moment.create({
        data: {
          projectId: plantasiaProject.id,
          name: m.name,
          description: m.description,
          iconEmoji: m.iconEmoji,
          orderIndex: m.orderIndex,
        },
      });
    }
    createdMoments.push(moment);
  }

  console.log(`✅ Created ${createdMoments.length} moments`);

  // Widgets
  const widgetData = [
    {
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
      name: 'Support Rating',
      type: WidgetType.INLINE_EMBED,
      publicKey: 'qw_demo_support',
      config: {
        theme: { primaryColor: '#22c55e' },
        questions: { scoreLabel: 'Rate your support experience', commentRequired: false },
      },
    },
  ];

  const createdWidgets = [];
  for (const w of widgetData) {
    let widget = await prisma.csatWidget.findFirst({
      where: { projectId: plantasiaProject.id, name: w.name },
    });
    if (!widget) {
      widget = await prisma.csatWidget.create({
        data: {
          projectId: plantasiaProject.id,
          name: w.name,
          type: w.type,
          publicKey: w.publicKey,
          configJson: w.config,
          isActive: true,
        },
      });
    }
    createdWidgets.push(widget);
  }

  console.log(`✅ Created ${createdWidgets.length} widgets`);

  // Sample CSAT Responses
  console.log('Creating sample CSAT responses...');

  const existingResponses = await prisma.csatResponse.count({
    where: { projectId: plantasiaProject.id },
  });

  if (existingResponses === 0) {
    const sampleResponses = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const momentIndex = Math.floor(Math.random() * createdMoments.length);
      const personaIndex = Math.floor(Math.random() * createdPersonas.length);
      const score = Math.floor(Math.random() * 3) + 3;

      sampleResponses.push({
        projectId: plantasiaProject.id,
        momentId: createdMoments[momentIndex].id,
        personaId: createdPersonas[personaIndex].id,
        widgetId: createdWidgets[0].id,
        score,
        comment: score >= 4 ? 'Great experience!' : score === 3 ? 'Could be better' : null,
        metadataJson: {},
        createdAt: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000),
      });
    }

    await prisma.csatResponse.createMany({
      data: sampleResponses,
    });

    console.log(`✅ Created ${sampleResponses.length} sample CSAT responses`);
  } else {
    console.log(`✅ CSAT responses already exist (${existingResponses})`);
  }

  // Demo Integrations
  console.log('Creating demo integrations...');

  const integrationData = [
    {
      type: IntegrationType.ZENDESK,
      direction: IntegrationDirection.INBOUND,
      displayName: 'Zendesk Support',
      description: 'Import satisfaction ratings from Zendesk tickets',
    },
    {
      type: IntegrationType.JIRA,
      direction: IntegrationDirection.OUTBOUND,
      displayName: 'Jira Product Board',
      description: 'Create issues from recommendations',
    },
  ];

  for (const intg of integrationData) {
    const existing = await prisma.integration.findFirst({
      where: {
        organizationId: demoOrg.id,
        type: intg.type,
      },
    });
    if (!existing) {
      await prisma.integration.create({
        data: {
          organizationId: demoOrg.id,
          type: intg.type,
          direction: intg.direction,
          displayName: intg.displayName,
          description: intg.description,
          isEnabled: true,
        },
      });
    }
  }

  console.log(`✅ Created ${integrationData.length} demo integrations`);

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
