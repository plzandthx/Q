'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageContainer, PageHeader } from '@/components/layout';
import { MetricCard } from '@/components/domain/metric-card';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const metrics = [
  {
    title: 'Overall CSAT',
    value: '4.2',
    change: 8,
    changeLabel: 'vs last month',
    icon: BarChart3,
  },
  {
    title: 'Total Responses',
    value: '12,543',
    change: 23,
    changeLabel: 'vs last month',
    icon: MessageSquare,
  },
  {
    title: 'Active Projects',
    value: '8',
    change: 2,
    changeLabel: 'new this month',
    icon: TrendingUp,
  },
  {
    title: 'Response Rate',
    value: '34%',
    change: -3,
    changeLabel: 'vs last month',
    icon: Users,
  },
];

const recentProjects = [
  {
    id: '1',
    name: 'Mobile App',
    score: 4.5,
    responses: 1234,
    trend: 'up',
  },
  {
    id: '2',
    name: 'Web Dashboard',
    score: 4.1,
    responses: 856,
    trend: 'up',
  },
  {
    id: '3',
    name: 'Customer Support',
    score: 3.8,
    responses: 2341,
    trend: 'down',
  },
];

const alerts = [
  {
    id: '1',
    type: 'warning',
    message: 'CSAT for "Checkout Flow" dropped below threshold',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'success',
    message: '"Mobile App" CSAT reached new high of 4.7',
    time: '1 day ago',
  },
  {
    id: '3',
    type: 'info',
    message: 'New persona detected: "Power Users"',
    time: '2 days ago',
  },
];

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your customer satisfaction metrics."
      >
        <Button asChild>
          <Link href="/app/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </PageHeader>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="space-y-8"
      >
        {/* Metrics Grid */}
        <motion.div
          variants={staggerContainerVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map((metric) => (
            <motion.div key={metric.title} variants={staggerItemVariants}>
              <MetricCard
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeLabel={metric.changeLabel}
                icon={metric.icon}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Projects */}
          <motion.div variants={staggerItemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Projects</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/app/projects">
                    View all
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/app/projects/${project.id}/overview`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900">
                            {project.name}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {project.responses.toLocaleString()} responses
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-neutral-900">
                              {project.score}
                            </p>
                            <div className="flex items-center gap-1 text-sm">
                              {project.trend === 'up' ? (
                                <>
                                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                                  <span className="text-green-600">Up</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                                  <span className="text-red-600">Down</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="w-16">
                            <Progress value={project.score * 20} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Alerts</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/app/alerts">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex gap-3 p-3 rounded-lg bg-neutral-50"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-neutral-700">{alert.message}</p>
                        <p className="mt-1 text-xs text-neutral-500">{alert.time}</p>
                      </div>
                      <Badge
                        variant={
                          alert.type === 'warning'
                            ? 'warning'
                            : alert.type === 'success'
                            ? 'success'
                            : 'secondary'
                        }
                        className="h-fit"
                      >
                        {alert.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto py-4" asChild>
                  <Link href="/app/projects/new" className="flex flex-col items-center gap-2">
                    <Plus className="h-5 w-5" />
                    <span>Create project</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4" asChild>
                  <Link href="/app/widgets" className="flex flex-col items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Configure widget</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4" asChild>
                  <Link href="/app/integrations" className="flex flex-col items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Add integration</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4" asChild>
                  <Link href="/app/reports/csat" className="flex flex-col items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>View reports</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
