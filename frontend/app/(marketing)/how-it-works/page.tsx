'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Code,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Play,
  Settings,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const steps = [
  {
    number: '01',
    title: 'Create your project',
    description:
      'Set up your Q CSAT account and create a project for your product or service. Define your customer personas and the moments that matter most.',
    icon: Settings,
    details: [
      'Quick 2-minute setup',
      'Import existing customer data',
      'Define personas (Power Users, New Users, etc.)',
      'Configure branding',
    ],
  },
  {
    number: '02',
    title: 'Deploy surveys',
    description:
      'Install our lightweight widget or use our API to start collecting feedback. Trigger surveys at the right moments.',
    icon: Code,
    details: [
      'Copy-paste embed snippet',
      'Customize survey appearance',
      'Set trigger conditions',
      'A/B test questions',
    ],
  },
  {
    number: '03',
    title: 'Analyze insights',
    description:
      'Watch your dashboard light up with real-time data. Our AI automatically identifies trends and surfaces actionable insights.',
    icon: LineChart,
    details: [
      'Real-time analytics',
      'Persona-based breakdowns',
      'Trend detection',
      'Sentiment analysis',
    ],
  },
  {
    number: '04',
    title: 'Take action',
    description:
      'Use insights to improve your product. Set up alerts, integrate with your tools, and close the feedback loop with customers.',
    icon: Zap,
    details: [
      'Automated alerts',
      'Team collaboration',
      'Integration workflows',
      'Follow-up automation',
    ],
  },
];

const useCases = [
  {
    title: 'After Purchase',
    description: 'Measure satisfaction immediately after a customer completes a purchase.',
    example: '"How satisfied are you with your purchase experience?"',
  },
  {
    title: 'Support Resolution',
    description: 'Understand how well your support team is meeting customer needs.',
    example: '"How would you rate the support you received?"',
  },
  {
    title: 'Feature Launch',
    description: 'Get feedback on new features and prioritize your roadmap.',
    example: '"How useful is this new feature for your workflow?"',
  },
  {
    title: 'Onboarding Complete',
    description: 'Ensure new customers are set up for success.',
    example: '"How easy was it to get started with our product?"',
  },
];

export default function HowItWorksPage() {
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
              How It Works
            </Badge>
          </motion.div>
          <motion.h1
            variants={staggerItemVariants}
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
          >
            From setup to insights
            <br />
            in minutes
          </motion.h1>
          <motion.p
            variants={staggerItemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600"
          >
            Q CSAT is designed to be simple to deploy and powerful to use. Here&apos;s how
            teams go from zero to actionable customer insights.
          </motion.p>
        </motion.div>

        {/* Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="relative mx-auto max-w-4xl">
            <div className="aspect-video rounded-xl border border-neutral-200 bg-neutral-100 flex items-center justify-center overflow-hidden">
              <button className="flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-white transition-transform hover:scale-105">
                <Play className="h-5 w-5 fill-current" />
                Watch 2-minute demo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-32"
        >
          <motion.h2
            variants={staggerItemVariants}
            className="text-center text-2xl font-bold text-neutral-900"
          >
            Four steps to customer clarity
          </motion.h2>

          <div className="mt-16 space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={staggerItemVariants}
                className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-primary-200">
                      {step.number}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <step.icon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-neutral-600">{step.description}</p>
                  <ul className="mt-6 space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-neutral-700">
                        <CheckCircle2 className="h-4 w-4 text-primary-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <Card className="overflow-hidden">
                    <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                      <step.icon className="h-24 w-24 text-neutral-200" />
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-32"
        >
          <motion.div variants={staggerItemVariants} className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">
              Moments That Matter
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              The best insights come from asking at the right time. Here are the
              touchpoints that matter most.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            className="mt-12 grid gap-6 sm:grid-cols-2"
          >
            {useCases.map((useCase) => (
              <motion.div key={useCase.title} variants={staggerItemVariants}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {useCase.title}
                    </h3>
                    <p className="mt-2 text-neutral-600">{useCase.description}</p>
                    <div className="mt-4 rounded-lg bg-neutral-50 p-3">
                      <p className="text-sm italic text-neutral-700">{useCase.example}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
            Ready to understand your customers?
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Start collecting feedback in under 5 minutes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
