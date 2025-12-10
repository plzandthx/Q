'use client';

import { motion } from 'framer-motion';
import { Plus, Bell, BellOff, MoreVertical, AlertTriangle, TrendingDown, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const alerts = [
  {
    id: '1',
    name: 'Low CSAT Alert',
    description: 'Trigger when CSAT drops below 4.0',
    condition: 'csat < 4.0',
    channels: ['email', 'slack'],
    enabled: true,
    lastTriggered: '2 days ago',
    triggeredCount: 3,
  },
  {
    id: '2',
    name: 'Response Volume Spike',
    description: 'Alert on unusual response volume',
    condition: 'responses > 200% of average',
    channels: ['slack'],
    enabled: true,
    lastTriggered: '1 week ago',
    triggeredCount: 1,
  },
  {
    id: '3',
    name: 'Negative Trend Alert',
    description: 'Trigger when CSAT shows declining trend',
    condition: 'csat trend < -5% over 7 days',
    channels: ['email'],
    enabled: false,
    lastTriggered: 'Never',
    triggeredCount: 0,
  },
];

const recentAlertHistory = [
  {
    id: '1',
    alertName: 'Low CSAT Alert',
    message: 'CSAT for "Checkout Flow" dropped to 3.8',
    time: '2 days ago',
    severity: 'warning',
  },
  {
    id: '2',
    alertName: 'Low CSAT Alert',
    message: 'CSAT for "Support Interaction" dropped to 3.6',
    time: '5 days ago',
    severity: 'critical',
  },
  {
    id: '3',
    alertName: 'Response Volume Spike',
    message: 'Unusual spike in responses detected (312% of average)',
    time: '1 week ago',
    severity: 'info',
  },
];

export default function AlertsPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="space-y-8"
    >
      {/* Alert Rules */}
      <motion.div variants={staggerItemVariants}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Alert Rules</h2>
            <p className="text-sm text-neutral-500">
              Configure notifications for important events
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        alert.enabled ? 'bg-primary-100' : 'bg-neutral-100'
                      }`}
                    >
                      {alert.enabled ? (
                        <Bell className="h-5 w-5 text-primary-600" />
                      ) : (
                        <BellOff className="h-5 w-5 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">
                          {alert.name}
                        </h3>
                        {!alert.enabled && (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                          {alert.condition}
                        </code>
                        <div className="flex items-center gap-1">
                          {alert.channels.includes('email') && (
                            <Mail className="h-4 w-4 text-neutral-400" />
                          )}
                          {alert.channels.includes('slack') && (
                            <MessageSquare className="h-4 w-4 text-neutral-400" />
                          )}
                        </div>
                        <span className="text-xs text-neutral-400">
                          Last triggered: {alert.lastTriggered}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch checked={alert.enabled} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Test Alert</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Alert History */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlertHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-neutral-50"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      item.severity === 'critical'
                        ? 'bg-red-100'
                        : item.severity === 'warning'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {item.severity === 'critical' ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : item.severity === 'warning' ? (
                      <TrendingDown className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Bell className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{item.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-neutral-500">
                        {item.alertName}
                      </span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-xs text-neutral-400">{item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
