'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// Mock integrations data - replace with API data
const allIntegrations = [
  {
    id: '1',
    name: 'Zendesk',
    description: 'Connect customer support tickets to CSAT surveys',
    category: 'Support',
    connected: true,
    popular: true,
  },
  {
    id: '2',
    name: 'Intercom',
    description: 'Trigger surveys after conversations',
    category: 'Support',
    connected: false,
    popular: true,
  },
  {
    id: '3',
    name: 'Freshdesk',
    description: 'Measure satisfaction for support tickets',
    category: 'Support',
    connected: false,
    popular: false,
  },
  {
    id: '4',
    name: 'Slack',
    description: 'Get real-time CSAT alerts in Slack channels',
    category: 'Communication',
    connected: true,
    popular: true,
  },
  {
    id: '5',
    name: 'Microsoft Teams',
    description: 'Send notifications to Teams channels',
    category: 'Communication',
    connected: false,
    popular: false,
  },
  {
    id: '6',
    name: 'Salesforce',
    description: 'Sync CSAT data with your CRM',
    category: 'CRM',
    connected: false,
    popular: true,
  },
  {
    id: '7',
    name: 'HubSpot',
    description: 'Track customer satisfaction in HubSpot',
    category: 'CRM',
    connected: false,
    popular: true,
  },
  {
    id: '8',
    name: 'Segment',
    description: 'Send CSAT events to your data warehouse',
    category: 'Analytics',
    connected: true,
    popular: true,
  },
  {
    id: '9',
    name: 'Mixpanel',
    description: 'Analyze CSAT alongside product analytics',
    category: 'Analytics',
    connected: false,
    popular: false,
  },
  {
    id: '10',
    name: 'Amplitude',
    description: 'Combine satisfaction data with user behavior',
    category: 'Analytics',
    connected: false,
    popular: false,
  },
  {
    id: '11',
    name: 'Jira',
    description: 'Create issues from low CSAT responses',
    category: 'Project Management',
    connected: false,
    popular: false,
  },
  {
    id: '12',
    name: 'Linear',
    description: 'Track feedback-driven issues',
    category: 'Project Management',
    connected: false,
    popular: false,
  },
  {
    id: '13',
    name: 'Zapier',
    description: 'Connect to 5000+ apps via Zapier',
    category: 'Automation',
    connected: false,
    popular: true,
  },
  {
    id: '14',
    name: 'Webhooks',
    description: 'Send data to any custom endpoint',
    category: 'Developer',
    connected: false,
    popular: false,
  },
];

const categories = [
  'All',
  'Support',
  'Communication',
  'CRM',
  'Analytics',
  'Project Management',
  'Automation',
  'Developer',
];

export default function IntegrationCatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredIntegrations = allIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(search.toLowerCase()) ||
      integration.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === 'All' || integration.category === category;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = allIntegrations.filter((i) => i.connected).length;

  return (
    <PageContainer>
      <PageHeader
        title="Integration Catalog"
        description="Browse and connect integrations to enhance your CSAT workflow."
        breadcrumbs={[
          { label: 'Integrations', href: '/app/integrations' },
          { label: 'Catalog' },
        ]}
      >
        <Badge variant="secondary">{connectedCount} connected</Badge>
      </PageHeader>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="space-y-6"
      >
        {/* Search */}
        <motion.div variants={staggerItemVariants}>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search integrations..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div variants={staggerItemVariants}>
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="flex-wrap h-auto gap-2">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="px-4">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Integrations Grid */}
        <motion.div
          variants={staggerContainerVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredIntegrations.map((integration) => (
            <motion.div key={integration.id} variants={staggerItemVariants}>
              <Card
                className={`h-full transition-colors ${
                  integration.connected
                    ? 'border-green-200 bg-green-50/30'
                    : 'hover:border-primary-300'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
                      <span className="text-lg font-bold text-neutral-600">
                        {integration.name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">
                          {integration.name}
                        </h3>
                        {integration.connected && (
                          <Badge
                            variant="default"
                            className="bg-green-500 text-xs"
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Connected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">
                        {integration.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {integration.category}
                        </Badge>
                        {integration.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {integration.connected ? (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/app/integrations/${integration.id}`}>
                          Configure
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full">
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredIntegrations.length === 0 && (
          <motion.div
            variants={staggerItemVariants}
            className="text-center py-12"
          >
            <p className="text-neutral-500">
              No integrations found matching your search.
            </p>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  );
}
