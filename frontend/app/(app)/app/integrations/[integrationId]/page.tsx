'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Settings,
  Activity,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// Mock integration data - replace with API data
const mockIntegration = {
  id: '1',
  name: 'Zendesk',
  description: 'Support ticket satisfaction surveys',
  category: 'Support',
  connected: true,
  lastSync: '5 minutes ago',
  apiKey: 'zd_••••••••••••••••',
  subdomain: 'acme',
  syncEnabled: true,
  webhookUrl: 'https://api.qcsat.io/webhooks/zendesk/abc123',
};

const recentLogs = [
  { id: '1', event: 'Ticket closed #12345', status: 'success', time: '2 min ago' },
  { id: '2', event: 'Survey sent to user@example.com', status: 'success', time: '5 min ago' },
  { id: '3', event: 'Response received', status: 'success', time: '8 min ago' },
  { id: '4', event: 'Webhook delivery failed', status: 'error', time: '15 min ago' },
  { id: '5', event: 'Ticket closed #12344', status: 'success', time: '20 min ago' },
];

export default function IntegrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [syncEnabled, setSyncEnabled] = useState(mockIntegration.syncEnabled);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    // TODO: Implement sync API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const handleDisconnect = () => {
    // TODO: Implement disconnect API call
    console.log('Disconnect integration:', params.integrationId);
    router.push('/app/integrations');
  };

  return (
    <PageContainer>
      <PageHeader
        title={mockIntegration.name}
        description={mockIntegration.description}
        breadcrumbs={[
          { label: 'Integrations', href: '/app/integrations' },
          { label: mockIntegration.name },
        ]}
      >
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Connected
          </Badge>
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </PageHeader>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
      >
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <LinkIcon className="mr-2 h-4 w-4" />
              Webhooks
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <motion.div
              variants={staggerContainerVariants}
              className="space-y-6 max-w-2xl"
            >
              <motion.div variants={staggerItemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Status</CardTitle>
                    <CardDescription>
                      Last synced: {mockIntegration.lastSync}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-sync enabled</p>
                        <p className="text-sm text-neutral-500">
                          Automatically sync data every 5 minutes
                        </p>
                      </div>
                      <Switch
                        checked={syncEnabled}
                        onCheckedChange={setSyncEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={staggerItemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700">
                        Subdomain
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Input
                          defaultValue={mockIntegration.subdomain}
                          className="max-w-xs"
                        />
                        <span className="text-neutral-500">.zendesk.com</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700">
                        API Key
                      </label>
                      <Input
                        type="password"
                        defaultValue={mockIntegration.apiKey}
                        className="mt-1 max-w-md"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        Your API key is encrypted and stored securely
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Danger Zone */}
              <motion.div variants={staggerItemVariants}>
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Disconnect Integration</p>
                        <p className="text-sm text-neutral-500">
                          Remove this integration from your account
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="danger">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Disconnect
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Disconnect {mockIntegration.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will stop all data syncing with{' '}
                              {mockIntegration.name}. You can reconnect at any
                              time.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDisconnect}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Disconnect
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <motion.div variants={staggerContainerVariants} className="space-y-6">
              <motion.div variants={staggerItemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Activity</CardTitle>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/app/integrations/logs">View All Logs</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            {log.status === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm">{log.event}</span>
                          </div>
                          <span className="text-xs text-neutral-500">
                            {log.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks">
            <motion.div
              variants={staggerContainerVariants}
              className="space-y-6 max-w-2xl"
            >
              <motion.div variants={staggerItemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Webhook URL</CardTitle>
                    <CardDescription>
                      Configure this URL in your {mockIntegration.name} webhook
                      settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={mockIntegration.webhookUrl}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            mockIntegration.webhookUrl
                          )
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </PageContainer>
  );
}
