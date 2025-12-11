'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Code, Eye, MoreVertical, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';
import { WidgetConfigFlyout, type Widget } from '@/components/domain/widget-config-flyout';

// TODO: Replace with API data
const widgetsData: Widget[] = [
  {
    id: '1',
    name: 'Main Feedback Widget',
    project: 'Mobile App',
    projectId: '1',
    moment: 'Post Purchase',
    momentId: 'm1',
    type: 'popup',
    status: 'active',
    responses: 12543,
    position: 'bottom-right',
    question: 'How satisfied are you with your purchase experience?',
    primaryColor: '#14b8a6',
    showBranding: true,
    trigger: 'page_load',
    delay: 3,
  },
  {
    id: '2',
    name: 'Support Survey',
    project: 'Customer Support',
    projectId: '3',
    moment: 'Support Ticket Closed',
    momentId: 'm2',
    type: 'popup',
    status: 'active',
    responses: 8234,
    position: 'center',
    question: 'How satisfied are you with the support you received?',
    primaryColor: '#3b82f6',
    showBranding: true,
    trigger: 'custom_event',
    delay: 0,
  },
  {
    id: '3',
    name: 'Inline Checkout',
    project: 'Checkout Flow',
    projectId: '4',
    moment: 'Checkout Complete',
    momentId: 'm3',
    type: 'inline',
    status: 'active',
    responses: 3421,
    position: 'embedded',
    question: 'How was your checkout experience?',
    primaryColor: '#10b981',
    showBranding: false,
    trigger: 'page_load',
    delay: 0,
  },
  {
    id: '4',
    name: 'Exit Survey',
    project: 'Web Dashboard',
    projectId: '2',
    moment: 'Dashboard Exit',
    momentId: 'm4',
    type: 'popup',
    status: 'paused',
    responses: 1234,
    position: 'center',
    question: 'Before you go, how was your experience today?',
    primaryColor: '#f59e0b',
    showBranding: true,
    trigger: 'exit_intent',
    delay: 0,
  },
];

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>(widgetsData);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  const handleConfigureClick = (widget: Widget) => {
    setSelectedWidget(widget);
    setFlyoutOpen(true);
  };

  const handleSaveWidget = async (widget: Widget, data: unknown) => {
    // TODO: Implement API call to save widget
    console.log('Saving widget:', widget.id, data);
    // Update local state for demo
    setWidgets(widgets.map(w =>
      w.id === widget.id
        ? { ...w, ...data as Partial<Widget> }
        : w
    ));
  };

  const handleDeleteWidget = async (widgetId: string) => {
    // TODO: Implement API call to delete widget
    console.log('Deleting widget:', widgetId);
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const handleToggleStatus = (widgetId: string) => {
    setWidgets(widgets.map(w =>
      w.id === widgetId
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  return (
    <PageContainer>
      <PageHeader
        title="Widgets"
        description="Manage all your feedback widgets across projects."
      >
        <Button asChild>
          <Link href="/app/widgets/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Widget
          </Link>
        </Button>
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
          className="grid gap-4 sm:grid-cols-3"
        >
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Total Widgets</p>
              <p className="text-3xl font-bold text-neutral-900">{widgets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Active Widgets</p>
              <p className="text-3xl font-bold text-neutral-900">
                {widgets.filter((w) => w.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-neutral-500">Total Responses</p>
              <p className="text-3xl font-bold text-neutral-900">
                {widgets
                  .reduce((acc, w) => acc + w.responses, 0)
                  .toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Widgets List */}
        <motion.div variants={staggerContainerVariants} className="space-y-4">
          {widgets.map((widget) => (
            <motion.div key={widget.id} variants={staggerItemVariants}>
              <Card className="hover:border-primary-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                        <Code className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleConfigureClick(widget)}
                            className="font-semibold text-neutral-900 hover:text-primary-600 text-left"
                          >
                            {widget.name}
                          </button>
                          <Badge
                            variant={
                              widget.status === 'active' ? 'default' : 'secondary'
                            }
                          >
                            {widget.status}
                          </Badge>
                          <Badge variant="outline">{widget.type}</Badge>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {widget.project}
                          {widget.moment && ` • ${widget.moment}`}
                          {' • '}
                          {widget.responses.toLocaleString()} responses
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfigureClick(widget)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleConfigureClick(widget)}>
                            Edit Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Get Embed Code</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(widget.id)}>
                            {widget.status === 'active' ? 'Pause' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteWidget(widget.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {widgets.length === 0 && (
          <motion.div
            variants={staggerItemVariants}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="rounded-full bg-neutral-100 p-4 mb-4">
              <Code className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">No widgets yet</h3>
            <p className="mt-1 text-neutral-600 max-w-sm">
              Create your first feedback widget to start collecting customer satisfaction data.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/app/widgets/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Widget
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Widget Configuration Flyout */}
      <WidgetConfigFlyout
        widget={selectedWidget}
        open={flyoutOpen}
        onOpenChange={setFlyoutOpen}
        onSave={handleSaveWidget}
        onDelete={handleDeleteWidget}
      />
    </PageContainer>
  );
}
