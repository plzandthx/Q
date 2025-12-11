'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

// Mock API keys data - replace with API data
const mockApiKeys = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'qcsat_live_••••••••••••••••',
    fullKey: 'qcsat_live_abc123xyz789def456',
    created: 'Jan 1, 2024',
    lastUsed: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'qcsat_test_••••••••••••••••',
    fullKey: 'qcsat_test_test123dev456key789',
    created: 'Feb 15, 2024',
    lastUsed: 'Never',
    status: 'active',
  },
];

export default function ApiKeysSettingsPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyCreated, setNewKeyCreated] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleCreateKey = () => {
    // TODO: Implement API key creation API call
    const newKey = {
      id: String(Date.now()),
      name: newKeyName,
      key: 'qcsat_live_••••••••••••••••',
      fullKey: `qcsat_live_${Math.random().toString(36).substring(2, 20)}`,
      created: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      lastUsed: 'Never',
      status: 'active',
    };
    setNewKeyCreated(newKey.fullKey);
    setApiKeys([...apiKeys, newKey]);
  };

  const handleDeleteKey = (id: string) => {
    // TODO: Implement API key deletion API call
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <PageContainer>
      <PageHeader
        title="API Keys"
        description="Manage API keys for programmatic access."
        breadcrumbs={[
          { label: 'Settings', href: '/app/settings' },
          { label: 'API Keys' },
        ]}
      >
        <Dialog
          open={showCreateDialog}
          onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) {
              setNewKeyName('');
              setNewKeyCreated(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newKeyCreated ? 'API Key Created' : 'Create API Key'}
              </DialogTitle>
              <DialogDescription>
                {newKeyCreated
                  ? 'Save this key now. You won\'t be able to see it again.'
                  : 'Give your API key a name to identify it later.'}
              </DialogDescription>
            </DialogHeader>

            {newKeyCreated ? (
              <div className="py-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Important</span>
                  </div>
                  <p className="text-sm text-amber-600">
                    This is the only time you&apos;ll see this API key. Copy it now
                    and store it securely.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={newKeyCreated}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(newKeyCreated)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Key Name
                </label>
                <Input
                  className="mt-1"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            )}

            <DialogFooter>
              {newKeyCreated ? (
                <Button onClick={() => setShowCreateDialog(false)}>Done</Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim()}
                  >
                    Create Key
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="space-y-6"
      >
        {/* API Keys List */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Use these keys to authenticate API requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {apiKeys.length === 0 ? (
                <div className="p-12 text-center">
                  <Key className="mx-auto h-12 w-12 text-neutral-300" />
                  <p className="mt-4 text-neutral-500">No API keys yet</p>
                  <p className="text-sm text-neutral-400">
                    Create your first API key to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-neutral-400" />
                          <p className="font-medium">{apiKey.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {apiKey.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <code className="text-sm bg-neutral-100 px-2 py-1 rounded font-mono">
                            {visibleKeys.has(apiKey.id)
                              ? apiKey.fullKey
                              : apiKey.key}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(apiKey.fullKey)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">
                          Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. Any applications
                              using this key will stop working.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteKey(apiKey.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Documentation Link */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">API Documentation</p>
                  <p className="text-sm text-neutral-500">
                    Learn how to use the Q CSAT API in your applications.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/docs/api" target="_blank">
                    View Docs
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
