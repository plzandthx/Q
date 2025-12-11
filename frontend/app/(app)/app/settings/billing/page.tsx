'use client';

import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// Mock billing data - replace with API data
const currentPlan = {
  name: 'Pro',
  price: '$49',
  interval: 'month',
  responses: 10000,
  usedResponses: 7543,
  features: [
    'Up to 10,000 responses/month',
    'Unlimited projects',
    'Advanced analytics',
    'Custom branding',
    'API access',
    'Email support',
  ],
};

const invoices = [
  { id: '1', date: 'Jan 1, 2024', amount: '$49.00', status: 'paid' },
  { id: '2', date: 'Dec 1, 2023', amount: '$49.00', status: 'paid' },
  { id: '3', date: 'Nov 1, 2023', amount: '$49.00', status: 'paid' },
];

const plans = [
  {
    name: 'Starter',
    price: '$0',
    interval: 'month',
    description: 'For small teams getting started',
    features: ['1,000 responses/month', '3 projects', 'Basic analytics'],
    current: false,
  },
  {
    name: 'Pro',
    price: '$49',
    interval: 'month',
    description: 'For growing businesses',
    features: [
      '10,000 responses/month',
      'Unlimited projects',
      'Advanced analytics',
      'Custom branding',
    ],
    current: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    interval: '',
    description: 'For large organizations',
    features: [
      'Unlimited responses',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
    ],
    current: false,
  },
];

export default function BillingSettingsPage() {
  const usagePercent = (currentPlan.usedResponses / currentPlan.responses) * 100;

  return (
    <PageContainer>
      <PageHeader
        title="Billing"
        description="Manage your subscription and billing information."
        breadcrumbs={[
          { label: 'Settings', href: '/app/settings' },
          { label: 'Billing' },
        ]}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="space-y-6"
      >
        {/* Current Plan */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    You&apos;re on the {currentPlan.name} plan
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-lg px-4 py-1">
                  {currentPlan.price}/{currentPlan.interval}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Usage</span>
                  <span className="text-sm text-neutral-500">
                    {currentPlan.usedResponses.toLocaleString()} /{' '}
                    {currentPlan.responses.toLocaleString()} responses
                  </span>
                </div>
                <Progress value={usagePercent} />
                {usagePercent > 80 && (
                  <p className="mt-2 text-sm text-amber-600">
                    You&apos;re approaching your monthly limit. Consider upgrading.
                  </p>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {currentPlan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plans */}
        <motion.div variants={staggerItemVariants}>
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={plan.current ? 'border-primary-500 bg-primary-50/30' : ''}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{plan.name}</h3>
                    {plan.current && <Badge>Current</Badge>}
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.interval && (
                      <span className="text-neutral-500">/{plan.interval}</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mb-4">
                    {plan.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.current ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : plan.name === 'Enterprise' ? (
                    <Button variant="outline" className="w-full">
                      Contact Sales
                    </Button>
                  ) : (
                    <Button className="w-full">
                      Upgrade
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neutral-100 rounded-lg">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-neutral-500">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline">Update</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoices */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-neutral-500">
                        {invoice.amount}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          invoice.status === 'paid' ? 'default' : 'secondary'
                        }
                        className={
                          invoice.status === 'paid' ? 'bg-green-500' : ''
                        }
                      >
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
