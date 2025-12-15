'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Code,
  Globe,
  Layers,
  MessageSquare,
  Puzzle,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const capabilities = [
  {
    id: 'collect',
    title: 'Collect',
    icon: MessageSquare,
    description: 'Gather feedback at every touchpoint',
    features: [
      {
        title: 'Embeddable Widgets',
        description:
          'Drop-in survey widgets that match your brand. Customize colors, questions, and timing.',
        icon: Code,
      },
      {
        title: 'Moments That Matter',
        description:
          'Trigger surveys at critical points: after purchase, support ticket resolution, onboarding completion.',
        icon: Target,
      },
      {
        title: 'Multi-channel',
        description:
          'Collect via web, email, mobile app, or API. Unified data from every channel.',
        icon: Globe,
      },
    ],
  },
  {
    id: 'analyze',
    title: 'Analyze',
    icon: BarChart3,
    description: 'Transform data into insights',
    features: [
      {
        title: 'Real-time Dashboards',
        description:
          'Live metrics, trends, and comparisons. Filter by date, segment, moment, or persona.',
        icon: BarChart3,
      },
      {
        title: 'Persona Intelligence',
        description:
          'Understand how different customer segments experience your product differently.',
        icon: Users,
      },
      {
        title: 'AI-Powered Insights',
        description:
          'Automatic trend detection, sentiment analysis, and recommendation engine.',
        icon: Sparkles,
      },
    ],
  },
  {
    id: 'act',
    title: 'Act',
    icon: Zap,
    description: 'Drive improvements and close the loop',
    features: [
      {
        title: 'Smart Alerts',
        description:
          'Get notified when scores drop, trends emerge, or thresholds are crossed.',
        icon: Bell,
      },
      {
        title: 'Integrations',
        description:
          'Push insights to Slack, Zendesk, Salesforce, and 50+ other tools automatically.',
        icon: Puzzle,
      },
      {
        title: 'Recommendations',
        description:
          'AI-generated action items based on your data. Know exactly what to improve.',
        icon: Target,
      },
    ],
  },
];

const integrations = [
  { name: 'Zendesk', category: 'Support' },
  { name: 'Intercom', category: 'Support' },
  { name: 'Salesforce', category: 'CRM' },
  { name: 'HubSpot', category: 'CRM' },
  { name: 'Slack', category: 'Communication' },
  { name: 'Microsoft Teams', category: 'Communication' },
  { name: 'Segment', category: 'Analytics' },
  { name: 'Amplitude', category: 'Analytics' },
  { name: 'Mixpanel', category: 'Analytics' },
  { name: 'Zapier', category: 'Automation' },
  { name: 'Webhooks', category: 'Developer' },
  { name: 'REST API', category: 'Developer' },
];

export default function ProductPage() {
  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="text-center"
        >
          <motion.div variants={staggerItemVariants}>
            <Badge variant="secondary" className="mb-4">
              Product
            </Badge>
          </motion.div>
          <motion.h1
            variants={staggerItemVariants}
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
          >
            The complete platform for
            <br />
            customer satisfaction
          </motion.h1>
          <motion.p
            variants={staggerItemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600"
          >
            From collection to action, Q CSAT gives you everything you need to measure,
            understand, and improve customer satisfaction.
          </motion.p>
          <motion.div
            variants={staggerItemVariants}
            className="mt-10 flex justify-center gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/how-it-works">See demo</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Capabilities Tabs */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-24"
        >
          <Tabs defaultValue="collect" className="w-full">
            <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
              {capabilities.map((cap) => (
                <TabsTrigger key={cap.id} value={cap.id} className="gap-2">
                  <cap.icon className="h-4 w-4" />
                  {cap.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {capabilities.map((cap) => (
              <TabsContent key={cap.id} value={cap.id} className="mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-2xl font-bold text-neutral-900">{cap.description}</h2>
                </motion.div>
                <div className="grid gap-8 md:grid-cols-3">
                  {cap.features.map((feature) => (
                    <Card key={feature.title} className="h-full">
                      <CardContent className="p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                          <feature.icon className="h-6 w-6 text-primary-600" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-neutral-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-32"
          id="integrations"
        >
          <motion.div variants={staggerItemVariants} className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Integrates with your stack
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Connect Q CSAT with the tools you already use. Data flows automatically.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          >
            {integrations.map((integration) => (
              <motion.div
                key={integration.name}
                variants={staggerItemVariants}
                className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <Layers className="h-8 w-8 text-neutral-400" />
                <p className="mt-2 text-sm font-medium text-neutral-900">
                  {integration.name}
                </p>
                <p className="text-xs text-neutral-500">{integration.category}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={staggerItemVariants} className="mt-8 text-center">
            <Link
              href="/docs/integrations"
              className="text-primary-600 hover:underline inline-flex items-center gap-1"
            >
              View all 50+ integrations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-32"
        >
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <CardContent className="p-8 md:p-12">
                <motion.div variants={staggerItemVariants}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <Shield className="h-6 w-6 text-primary-600" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                    Enterprise-grade security
                  </h2>
                  <p className="mt-4 text-neutral-600">
                    Your customer data is precious. We protect it with industry-leading
                    security practices and compliance certifications.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      'SOC 2 Type II certified',
                      'GDPR compliant',
                      'Encryption at rest and in transit',
                      'SSO/SAML support',
                      '99.99% uptime SLA',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-neutral-700">
                        <Shield className="h-4 w-4 text-primary-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-8" variant="outline" asChild>
                    <Link href="/security">Learn about security</Link>
                  </Button>
                </motion.div>
              </CardContent>
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-8 md:p-12 flex items-center justify-center">
                <Shield className="h-32 w-32 text-white/20" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerItemVariants}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl font-bold text-neutral-900">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
