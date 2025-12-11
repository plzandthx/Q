'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// Mock alerts data - replace with API data
const mockAlerts = [
  {
    id: '1',
    type: 'warning',
    title: 'CSAT Score Below Threshold',
    message: 'CSAT for "Checkout Flow" dropped to 3.2 (threshold: 4.0)',
    project: 'Checkout Flow',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'CSAT Goal Achieved',
    message: '"Mobile App" CSAT reached new high of 4.7',
    project: 'Mobile App',
    time: '1 day ago',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'New Persona Detected',
    message: 'AI detected a new user segment: "Power Users" in Mobile App',
    project: 'Mobile App',
    time: '2 days ago',
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Response Rate Declining',
    message: 'Response rate for "Web Dashboard" dropped by 15% this week',
    project: 'Web Dashboard',
    time: '3 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Weekly Summary Available',
    message: 'Your weekly CSAT summary report is ready to view',
    project: null,
    time: '4 days ago',
    read: true,
  },
  {
    id: '6',
    type: 'success',
    title: 'Integration Connected',
    message: 'Zendesk integration is now active and syncing',
    project: null,
    time: '5 days ago',
    read: true,
  },
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getAlertBadgeVariant = (type: string) => {
  switch (type) {
    case 'warning':
      return 'warning';
    case 'success':
      return 'success';
    case 'info':
    default:
      return 'secondary';
  }
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const unreadCount = alerts.filter((a) => !a.read).length;

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.read;
    return alert.type === filter;
  });

  const toggleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map((a) => a.id));
    }
  };

  const markAsRead = (ids: string[]) => {
    setAlerts(
      alerts.map((a) => (ids.includes(a.id) ? { ...a, read: true } : a))
    );
    setSelectedAlerts([]);
  };

  const deleteAlerts = (ids: string[]) => {
    setAlerts(alerts.filter((a) => !ids.includes(a.id)));
    setSelectedAlerts([]);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Alerts"
        description="Stay informed about important changes in your CSAT metrics."
      >
        {unreadCount > 0 && (
          <Badge variant="default">{unreadCount} unread</Badge>
        )}
      </PageHeader>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="space-y-6"
      >
        {/* Stats */}
        <motion.div
          variants={staggerContainerVariants}
          className="grid gap-4 sm:grid-cols-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  <Bell className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                  <p className="text-sm text-neutral-500">Total Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                  <p className="text-sm text-neutral-500">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {alerts.filter((a) => a.type === 'warning').length}
                  </p>
                  <p className="text-sm text-neutral-500">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {alerts.filter((a) => a.type === 'success').length}
                  </p>
                  <p className="text-sm text-neutral-500">Successes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div variants={staggerItemVariants}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="success">Successes</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">
                  {selectedAlerts.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAsRead(selectedAlerts)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAlerts(selectedAlerts)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Alerts List */}
        <motion.div variants={staggerContainerVariants}>
          <Card>
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center gap-4 px-6 py-3 border-b bg-neutral-50">
                <Checkbox
                  checked={
                    selectedAlerts.length === filteredAlerts.length &&
                    filteredAlerts.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium text-neutral-500">
                  {filteredAlerts.length} alerts
                </span>
              </div>

              {/* Alert Items */}
              {filteredAlerts.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="mx-auto h-12 w-12 text-neutral-300" />
                  <p className="mt-4 text-neutral-500">No alerts to display</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      variants={staggerItemVariants}
                      className={`flex items-start gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors ${
                        !alert.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <Checkbox
                        checked={selectedAlerts.includes(alert.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAlerts([...selectedAlerts, alert.id]);
                          } else {
                            setSelectedAlerts(
                              selectedAlerts.filter((id) => id !== alert.id)
                            );
                          }
                        }}
                      />
                      <div className="flex-shrink-0 mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-medium ${
                              !alert.read
                                ? 'text-neutral-900'
                                : 'text-neutral-700'
                            }`}
                          >
                            {alert.title}
                          </h3>
                          {!alert.read && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">
                          {alert.message}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs text-neutral-500">
                            {alert.time}
                          </span>
                          {alert.project && (
                            <Badge variant="outline" className="text-xs">
                              {alert.project}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!alert.read && (
                            <DropdownMenuItem
                              onClick={() => markAsRead([alert.id])}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => deleteAlerts([alert.id])}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
