'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Code, Eye, MoreVertical, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const widgets = [
  {
    id: '1',
    name: 'Main Feedback Widget',
    project: 'Mobile App',
    type: 'popup',
    status: 'active',
    responses: 12543,
    position: 'bottom-right',
  },
  {
    id: '2',
    name: 'Support Survey',
    project: 'Customer Support',
    type: 'popup',
    status: 'active',
    responses: 8234,
    position: 'center',
  },
  {
    id: '3',
    name: 'Inline Checkout',
    project: 'Checkout Flow',
    type: 'inline',
    status: 'active',
    responses: 3421,
    position: 'embedded',
  },
  {
    id: '4',
    name: 'Exit Survey',
    project: 'Web Dashboard',
    type: 'popup',
    status: 'paused',
    responses: 1234,
    position: 'center',
  },
];

export default function WidgetsPage() {
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
                          <Link
                            href={`/app/widgets/${widget.id}`}
                            className="font-semibold text-neutral-900 hover:text-primary-600"
                          >
                            {widget.name}
                          </Link>
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
                          {widget.project} • {widget.responses.toLocaleString()} responses
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/app/widgets/${widget.id}`}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configure
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Get Embed Code</DropdownMenuItem>
                          <DropdownMenuItem>
                            {widget.status === 'active' ? 'Pause' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
      </motion.div>
    </PageContainer>
  );
}
