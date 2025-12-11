'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const connectedIntegrations = [
  {
    id: '1',
    name: 'Zendesk',
    description: 'Support ticket satisfaction surveys',
    category: 'Support',
    connected: true,
    lastSync: '5 minutes ago',
  },
  {
    id: '2',
    name: 'Slack',
    description: 'Real-time notifications',
    category: 'Communication',
    connected: true,
    lastSync: '1 minute ago',
  },
  {
    id: '3',
    name: 'Segment',
    description: 'Event routing',
    category: 'Analytics',
    connected: true,
    lastSync: '2 minutes ago',
  },
];

const catalogIntegrations = [
  { id: '4', name: 'Intercom', description: 'Customer messaging', category: 'Support' },
  { id: '5', name: 'Salesforce', description: 'CRM integration', category: 'CRM' },
  { id: '6', name: 'HubSpot', description: 'Marketing automation', category: 'CRM' },
  { id: '7', name: 'Mixpanel', description: 'Product analytics', category: 'Analytics' },
  { id: '8', name: 'Amplitude', description: 'Product analytics', category: 'Analytics' },
  { id: '9', name: 'Microsoft Teams', description: 'Team notifications', category: 'Communication' },
  { id: '10', name: 'Jira', description: 'Issue tracking', category: 'Project Management' },
  { id: '11', name: 'Linear', description: 'Issue tracking', category: 'Project Management' },
  { id: '12', name: 'Zapier', description: 'Workflow automation', category: 'Automation' },
];

export default function IntegrationsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Integrations"
        description="Connect Q CSAT with your favorite tools and services."
        actions={
          <Button variant="outline" asChild>
            <Link href="/app/integrations/logs">
              View Logs
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
      >
        <Tabs defaultValue="connected" className="space-y-6">
          <TabsList>
            <TabsTrigger value="connected">
              Connected ({connectedIntegrations.length})
            </TabsTrigger>
            <TabsTrigger value="catalog">Browse Catalog</TabsTrigger>
          </TabsList>

          {/* Connected Tab */}
          <TabsContent value="connected">
            <motion.div
              variants={staggerContainerVariants}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {connectedIntegrations.map((integration) => (
                <motion.div key={integration.id} variants={staggerItemVariants}>
                  <Card>
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
                            <p className="text-sm text-neutral-500">
                              {integration.description}
                            </p>
                            <p className="text-xs text-neutral-400 mt-1">
                              Last sync: {integration.lastSync}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/app/integrations/${integration.id}`}>
                            <Settings className="mr-2 h-4 w-4" />
                            Configure
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Catalog Tab */}
          <TabsContent value="catalog">
            <motion.div variants={staggerItemVariants} className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input placeholder="Search integrations..." className="pl-9" />
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainerVariants}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {catalogIntegrations.map((integration) => (
                <motion.div key={integration.id} variants={staggerItemVariants}>
                  <Card className="hover:border-primary-300 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
                          <span className="text-lg font-bold text-neutral-600">
                            {integration.name[0]}
                          </span>
                        </div>
                        <div className="flex-1">
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
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </PageContainer>
  );
}
