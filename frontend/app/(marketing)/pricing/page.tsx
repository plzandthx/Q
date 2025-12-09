'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const plans = [
  {
    name: 'Starter',
    description: 'For small teams getting started with CSAT',
    price: '$49',
    period: '/month',
    features: [
      { text: 'Up to 1,000 responses/month', tooltip: 'CSAT survey responses collected' },
      { text: '1 project', tooltip: 'Separate environments for different products' },
      { text: '3 team members', tooltip: 'Users who can access the dashboard' },
      { text: '5 Moments That Matter', tooltip: 'Custom touchpoint tracking' },
      { text: 'Basic analytics', tooltip: 'Standard charts and metrics' },
      { text: 'Email support', tooltip: 'Response within 24 hours' },
    ],
    cta: 'Start Free Trial',
    href: '/auth/sign-up?plan=starter',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing teams that need more insights',
    price: '$149',
    period: '/month',
    features: [
      { text: 'Up to 10,000 responses/month', tooltip: 'CSAT survey responses collected' },
      { text: '5 projects', tooltip: 'Separate environments for different products' },
      { text: '10 team members', tooltip: 'Users who can access the dashboard' },
      { text: 'Unlimited Moments', tooltip: 'Track every touchpoint' },
      { text: 'Persona intelligence', tooltip: 'Segment analysis by customer type' },
      { text: 'Advanced analytics', tooltip: 'AI-powered insights and trends' },
      { text: 'Integrations (Zendesk, Intercom)', tooltip: 'Connect your existing tools' },
      { text: 'Priority support', tooltip: 'Response within 4 hours' },
    ],
    cta: 'Start Free Trial',
    href: '/auth/sign-up?plan=professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 'Custom',
    period: '',
    features: [
      { text: 'Unlimited responses', tooltip: 'No limits on data collection' },
      { text: 'Unlimited projects', tooltip: 'As many as you need' },
      { text: 'Unlimited team members', tooltip: 'Your whole organization' },
      { text: 'Custom integrations', tooltip: 'We build what you need' },
      { text: 'SSO/SAML', tooltip: 'Enterprise authentication' },
      { text: 'Dedicated success manager', tooltip: 'Your personal Q CSAT expert' },
      { text: 'Custom SLA', tooltip: 'Guaranteed uptime and response times' },
      { text: '24/7 phone support', tooltip: 'Always available' },
      { text: 'On-premise option', tooltip: 'Self-hosted deployment' },
    ],
    cta: 'Contact Sales',
    href: '/contact?type=enterprise',
    popular: false,
  },
];

const faqs = [
  {
    question: 'What counts as a response?',
    answer:
      'A response is any completed CSAT survey submission. Partial submissions or abandoned surveys do not count toward your limit.',
  },
  {
    question: 'Can I change plans at any time?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we prorate the difference.',
  },
  {
    question: 'What happens if I exceed my response limit?',
    answer:
      "We'll notify you when you're approaching your limit. If you exceed it, you can upgrade your plan or purchase additional responses.",
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer:
      'Yes! Annual billing saves you 20% compared to monthly billing. Contact us for more details.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes, all plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What integrations are included?',
    answer:
      'Professional includes Zendesk, Intercom, Slack, and Salesforce. Enterprise includes all 50+ integrations plus custom builds.',
  },
];

export default function PricingPage() {
  return (
    <TooltipProvider>
      <div className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
            className="text-center"
          >
            <motion.h1
              variants={staggerItemVariants}
              className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p
              variants={staggerItemVariants}
              className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600"
            >
              Choose the plan that fits your team. All plans include a 14-day free
              trial with no credit card required.
            </motion.p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
            className="mt-16 grid gap-8 lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={staggerItemVariants}>
                <Card
                  className={`relative h-full ${
                    plan.popular
                      ? 'border-primary-500 shadow-lg ring-1 ring-primary-500'
                      : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-sm text-neutral-600">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-neutral-900">
                        {plan.price}
                      </span>
                      <span className="text-neutral-600">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'primary' : 'outline'}
                      asChild
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                    <ul className="mt-8 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-3">
                          <Check className="h-5 w-5 flex-shrink-0 text-primary-500" />
                          <span className="text-sm text-neutral-700">
                            {feature.text}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 flex-shrink-0 text-neutral-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="mt-24"
          >
            <motion.h2
              variants={staggerItemVariants}
              className="text-2xl font-bold text-neutral-900 text-center"
            >
              Frequently asked questions
            </motion.h2>
            <motion.div
              variants={staggerContainerVariants}
              className="mt-12 grid gap-8 md:grid-cols-2"
            >
              {faqs.map((faq) => (
                <motion.div key={faq.question} variants={staggerItemVariants}>
                  <h3 className="font-semibold text-neutral-900">{faq.question}</h3>
                  <p className="mt-2 text-neutral-600">{faq.answer}</p>
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
            className="mt-24 text-center"
          >
            <p className="text-neutral-600">
              Need a custom solution?{' '}
              <Link href="/contact" className="text-primary-600 hover:underline">
                Talk to our sales team
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
