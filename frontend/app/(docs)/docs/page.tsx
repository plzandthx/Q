'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code,
  Plug,
  Zap,
  ArrowRight,
  Terminal,
  FileText,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const quickLinks = [
  {
    title: 'Quick Start',
    description: 'Get up and running in under 5 minutes',
    href: '/docs/getting-started/quick-start',
    icon: Zap,
  },
  {
    title: 'Widget Embed',
    description: 'Add surveys to your website or app',
    href: '/docs/widgets/embed',
    icon: Code,
  },
  {
    title: 'API Reference',
    description: 'Full REST API documentation',
    href: '/docs/api/authentication',
    icon: Terminal,
  },
  {
    title: 'Integrations',
    description: 'Connect with your tools',
    href: '/docs/integrations/overview',
    icon: Plug,
  },
];

const popularGuides = [
  { title: 'Creating Your First Project', href: '/docs/projects/creating' },
  { title: 'Setting Up Moments That Matter', href: '/docs/projects/moments' },
  { title: 'Customizing Widget Appearance', href: '/docs/widgets/customization' },
  { title: 'Connecting Zendesk', href: '/docs/integrations/zendesk' },
  { title: 'Understanding Personas', href: '/docs/projects/personas' },
  { title: 'Setting Up Webhooks', href: '/docs/integrations/webhooks' },
];

export default function DocsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="space-y-12"
    >
      {/* Header */}
      <motion.div variants={staggerItemVariants}>
        <Badge variant="secondary" className="mb-4">
          Documentation
        </Badge>
        <h1 className="text-4xl font-bold text-neutral-900">
          Q CSAT Documentation
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Everything you need to collect, analyze, and act on customer feedback.
        </p>
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={staggerItemVariants}>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full hover:border-primary-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <link.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {link.title}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-1">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Popular Guides */}
      <motion.div variants={staggerItemVariants}>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Popular Guides
        </h2>
        <div className="grid gap-2">
          {popularGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-700">{guide.title}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Code Example */}
      <motion.div variants={staggerItemVariants}>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Quick Example
        </h2>
        <div className="rounded-lg bg-neutral-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <pre className="text-sm text-neutral-100 overflow-x-auto">
            <code>{`<!-- Add the Q CSAT widget to your site -->
<script src="https://cdn.qcsat.io/widget.js"></script>
<script>
  QCSATWidget.init({
    projectId: 'your-project-id',
    position: 'bottom-right'
  });
</script>`}</code>
          </pre>
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          That&apos;s it! The widget will appear based on your configured triggers.{' '}
          <Link
            href="/docs/widgets/embed"
            className="text-primary-600 hover:underline"
          >
            Learn more about embedding
          </Link>
        </p>
      </motion.div>

      {/* Help */}
      <motion.div variants={staggerItemVariants}>
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Need Help?
            </h2>
            <p className="text-neutral-600 mt-2">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/contact"
                className="text-primary-600 hover:underline text-sm font-medium"
              >
                Contact Support
              </Link>
              <span className="text-neutral-300">|</span>
              <Link
                href="/status"
                className="text-primary-600 hover:underline text-sm font-medium"
              >
                System Status
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
