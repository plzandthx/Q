'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with real-time status API data
const systems = [
  { name: 'API', status: 'operational', uptime: '99.99%' },
  { name: 'Dashboard', status: 'operational', uptime: '99.98%' },
  { name: 'Widget Service', status: 'operational', uptime: '99.99%' },
  { name: 'Analytics Engine', status: 'operational', uptime: '99.97%' },
  { name: 'Integrations', status: 'operational', uptime: '99.95%' },
  { name: 'Email Delivery', status: 'operational', uptime: '99.99%' },
];

const incidents = [
  {
    date: '2024-03-10',
    title: 'Scheduled Maintenance',
    status: 'resolved',
    description: 'Database optimization completed successfully with no downtime.',
  },
  {
    date: '2024-02-28',
    title: 'Elevated API Latency',
    status: 'resolved',
    description:
      'Brief period of increased latency affecting some API calls. Root cause identified and patched.',
    duration: '12 minutes',
  },
  {
    date: '2024-02-15',
    title: 'Integration Sync Delay',
    status: 'resolved',
    description:
      'Zendesk integration experienced delayed syncing. Fixed within SLA.',
    duration: '8 minutes',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'degraded':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'outage':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-neutral-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'operational':
      return <Badge className="bg-green-100 text-green-700">Operational</Badge>;
    case 'degraded':
      return <Badge className="bg-yellow-100 text-yellow-700">Degraded</Badge>;
    case 'outage':
      return <Badge className="bg-red-100 text-red-700">Outage</Badge>;
    case 'resolved':
      return <Badge variant="outline">Resolved</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function StatusPage() {
  const allOperational = systems.every((s) => s.status === 'operational');

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="text-center"
        >
          <motion.div variants={staggerItemVariants}>
            <Badge variant="secondary" className="mb-4">
              Status
            </Badge>
          </motion.div>
          <motion.h1
            variants={staggerItemVariants}
            className="text-4xl font-bold tracking-tight text-neutral-900"
          >
            System Status
          </motion.h1>
          <motion.div variants={staggerItemVariants} className="mt-6">
            {allOperational ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">All Systems Operational</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-yellow-700">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Some Systems Degraded</span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systems.map((system) => (
                  <motion.div
                    key={system.name}
                    variants={staggerItemVariants}
                    className="flex items-center justify-between border-b border-neutral-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(system.status)}
                      <span className="font-medium text-neutral-900">
                        {system.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-neutral-500">
                        {system.uptime} uptime
                      </span>
                      {getStatusBadge(system.status)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Uptime Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>90-Day Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 flex-1 rounded-sm bg-green-400 transition-colors hover:bg-green-500"
                    title={`Day ${90 - i}: 100% uptime`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-neutral-500">
                <span>90 days ago</span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Incidents */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold text-neutral-900">Recent Incidents</h2>
          <div className="mt-6 space-y-6">
            {incidents.map((incident) => (
              <motion.div key={incident.date} variants={staggerItemVariants}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-neutral-900">
                            {incident.title}
                          </h3>
                          {getStatusBadge(incident.status)}
                        </div>
                        <p className="mt-1 text-sm text-neutral-500">
                          {new Date(incident.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {incident.duration && ` · Duration: ${incident.duration}`}
                        </p>
                        <p className="mt-2 text-neutral-600">{incident.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subscribe */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-600">
            Subscribe to status updates via{' '}
            <a href="/contact" className="text-primary-600 hover:underline">
              email
            </a>{' '}
            or{' '}
            <a href="/status/rss.xml" className="text-primary-600 hover:underline">
              RSS
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
