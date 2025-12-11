'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const releases = [
  {
    version: '2.5.0',
    date: 'March 15, 2024',
    type: 'feature',
    title: 'AI-Powered Recommendations',
    changes: [
      'Added AI-generated recommendations based on CSAT data',
      'New recommendation dashboard with priority scoring',
      'Integration with Slack for recommendation alerts',
      'Improved trend detection algorithms',
    ],
  },
  {
    version: '2.4.2',
    date: 'March 10, 2024',
    type: 'fix',
    title: 'Bug Fixes & Improvements',
    changes: [
      'Fixed widget positioning on mobile devices',
      'Improved survey response time',
      'Fixed Zendesk integration sync issues',
      'Performance improvements for large datasets',
    ],
  },
  {
    version: '2.4.0',
    date: 'February 28, 2024',
    type: 'feature',
    title: 'Persona Intelligence',
    changes: [
      'New persona segmentation feature',
      'Automatic persona detection based on behavior',
      'Per-persona CSAT tracking and analytics',
      'Customizable persona rules',
    ],
  },
  {
    version: '2.3.0',
    date: 'February 15, 2024',
    type: 'feature',
    title: 'Enhanced Integrations',
    changes: [
      'Added Intercom integration',
      'Added Microsoft Teams notifications',
      'Improved Salesforce sync',
      'New webhook payload options',
    ],
  },
  {
    version: '2.2.1',
    date: 'February 1, 2024',
    type: 'fix',
    title: 'Security Update',
    changes: [
      'Enhanced data encryption',
      'Improved session management',
      'Security audit fixes',
      'Updated dependencies',
    ],
  },
];

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'feature':
      return 'default';
    case 'fix':
      return 'secondary';
    case 'security':
      return 'danger';
    default:
      return 'outline';
  }
};

export default function ChangelogPage() {
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
          <span className="text-neutral-900">Changelog</span>
        </nav>
      </motion.div>

      {/* Header */}
      <motion.div variants={staggerItemVariants}>
        <h1 className="text-3xl font-bold text-neutral-900">Changelog</h1>
        <p className="mt-4 text-lg text-neutral-600">
          New features, improvements, and bug fixes.
        </p>
      </motion.div>

      {/* Releases */}
      <motion.div variants={staggerContainerVariants} className="space-y-8">
        {releases.map((release) => (
          <motion.div
            key={release.version}
            variants={staggerItemVariants}
            id={`v${release.version}`}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-neutral-900">
                        v{release.version}
                      </h2>
                      <Badge variant={getBadgeVariant(release.type)}>
                        {release.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">{release.date}</p>
                  </div>
                </div>
                <h3 className="mt-4 font-medium text-neutral-900">
                  {release.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {release.changes.map((change, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-neutral-600"
                    >
                      <span className="text-primary-500 mt-1">•</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Subscribe */}
      <motion.div variants={staggerItemVariants}>
        <Card className="bg-neutral-50">
          <CardContent className="p-6 text-center">
            <p className="text-neutral-600">
              Subscribe to release notes via{' '}
              <a href="/docs/changelog/rss.xml" className="text-primary-600 hover:underline">
                RSS
              </a>{' '}
              or follow us on{' '}
              <a href="https://twitter.com/qcsat" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                Twitter
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
