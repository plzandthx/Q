'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Check, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const connectedIntegrations = [
  {
    id: '1',
    name: 'Zendesk',
    description: 'Send satisfaction surveys after ticket resolution',
    status: 'connected',
    lastSync: '5 minutes ago',
  },
  {
    id: '2',
    name: 'Slack',
    description: 'Get real-time alerts in your Slack channels',
    status: 'connected',
    lastSync: '1 minute ago',
  },
];

const availableIntegrations = [
  {
    id: '3',
    name: 'Intercom',
    description: 'Trigger surveys based on Intercom conversations',
    category: 'Support',
  },
  {
    id: '4',
    name: 'Salesforce',
    description: 'Sync CSAT data with Salesforce records',
    category: 'CRM',
  },
  {
    id: '5',
    name: 'HubSpot',
    description: 'Connect feedback to your HubSpot contacts',
    category: 'CRM',
  },
  {
    id: '6',
    name: 'Segment',
    description: 'Route CSAT events through Segment',
    category: 'Analytics',
  },
];

export default function ProjectIntegrationsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="space-y-8"
    >
      {/* Connected Integrations */}
      <motion.div variants={staggerItemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Connected Integrations
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/integrations/catalog">
              Browse All
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {connectedIntegrations.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {connectedIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
                        <span className="text-lg font-bold text-neutral-600">
                          {integration.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-neutral-900">
                            {integration.name}
                          </h3>
                          <Badge variant="default" className="bg-green-500">
                            <Check className="mr-1 h-3 w-3" />
                            Connected
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">
                          {integration.description}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Last sync: {integration.lastSync}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-neutral-500">No integrations connected yet</p>
              <Button className="mt-4" asChild>
                <Link href="/app/integrations/catalog">
                  Browse Integrations
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Available Integrations */}
      <motion.div variants={staggerItemVariants}>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Available Integrations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {availableIntegrations.map((integration) => (
            <Card
              key={integration.id}
              className="hover:border-primary-300 transition-colors cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
                      <span className="text-lg font-bold text-neutral-600">
                        {integration.name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">
                          {integration.name}
                        </h3>
                        <Badge variant="outline">{integration.category}</Badge>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
