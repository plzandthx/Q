'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const steps = [
  {
    number: '1',
    title: 'Create Your Account',
    description: 'Sign up for Q CSAT and create your organization.',
    code: null,
  },
  {
    number: '2',
    title: 'Create a Project',
    description: 'Set up a project for your product or service.',
    code: null,
  },
  {
    number: '3',
    title: 'Add the Widget',
    description: 'Copy and paste the embed code into your website.',
    code: `<script src="https://cdn.qcsat.io/widget.js"></script>
<script>
  QCSATWidget.init({
    projectId: 'proj_xxxxxxxxxxxxx',
    position: 'bottom-right'
  });
</script>`,
  },
  {
    number: '4',
    title: 'Configure Triggers',
    description: 'Set up when and where your surveys should appear.',
    code: `QCSATWidget.init({
  projectId: 'proj_xxxxxxxxxxxxx',
  triggers: [
    { event: 'purchase_complete' },
    { page: '/checkout/success' },
    { delay: 30000 } // 30 seconds
  ]
});`,
  },
];

export default function QuickStartPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="space-y-8"
    >
      {/* Breadcrumb */}
      <motion.div variants={staggerItemVariants}>
        <nav className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/docs" className="hover:text-neutral-700">
            Docs
          </Link>
          <span>/</span>
          <Link href="/docs/getting-started" className="hover:text-neutral-700">
            Getting Started
          </Link>
          <span>/</span>
          <span className="text-neutral-900">Quick Start</span>
        </nav>
      </motion.div>

      {/* Header */}
      <motion.div variants={staggerItemVariants}>
        <Badge variant="secondary" className="mb-4">
          5 minute read
        </Badge>
        <h1 className="text-3xl font-bold text-neutral-900">Quick Start Guide</h1>
        <p className="mt-4 text-lg text-neutral-600">
          Get Q CSAT up and running in your application in under 5 minutes.
        </p>
      </motion.div>

      {/* Prerequisites */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Prerequisites
            </h2>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-neutral-600">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                A Q CSAT account (
                <Link
                  href="/auth/sign-up"
                  className="text-primary-600 hover:underline"
                >
                  sign up free
                </Link>
                )
              </li>
              <li className="flex items-center gap-2 text-neutral-600">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Access to your website or application code
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Steps */}
      <motion.div variants={staggerContainerVariants} className="space-y-8">
        {steps.map((step) => (
          <motion.div key={step.number} variants={staggerItemVariants}>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white font-semibold text-sm">
                {step.number}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {step.title}
                </h2>
                <p className="mt-2 text-neutral-600">{step.description}</p>
                {step.code && (
                  <div className="mt-4 relative">
                    <pre className="rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100 overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => navigator.clipboard.writeText(step.code!)}
                    >
                      <Copy className="mr-2 h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Next Steps */}
      <motion.div variants={staggerItemVariants}>
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Next Steps
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/docs/projects/moments"
                  className="flex items-center gap-2 text-primary-600 hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Configure Moments That Matter
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/widgets/customization"
                  className="flex items-center gap-2 text-primary-600 hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Customize your widget appearance
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/integrations/overview"
                  className="flex items-center gap-2 text-primary-600 hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Set up integrations
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div
        variants={staggerItemVariants}
        className="flex justify-between pt-8 border-t border-neutral-200"
      >
        <div />
        <Link
          href="/docs/getting-started/installation"
          className="flex items-center gap-2 text-primary-600 hover:underline"
        >
          Installation Guide
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
