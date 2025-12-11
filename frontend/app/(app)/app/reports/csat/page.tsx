'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// Mock data - replace with API data
const overviewMetrics = {
  overallCSAT: 4.2,
  csatChange: 8,
  totalResponses: 12543,
  responsesChange: 23,
  responseRate: 34,
  responseRateChange: -3,
  nps: 42,
  npsChange: 5,
};

const projectBreakdown = [
  { name: 'Mobile App', score: 4.5, responses: 4521, change: 12 },
  { name: 'Web Dashboard', score: 4.1, responses: 3234, change: 5 },
  { name: 'Customer Support', score: 3.8, responses: 2876, change: -8 },
  { name: 'Checkout Flow', score: 3.2, responses: 1912, change: -15 },
];

const scoreDistribution = [
  { score: 5, count: 5432, percentage: 43 },
  { score: 4, count: 3876, percentage: 31 },
  { score: 3, count: 1892, percentage: 15 },
  { score: 2, count: 876, percentage: 7 },
  { score: 1, count: 467, percentage: 4 },
];

const _trendData = [
  { period: 'Week 1', score: 4.0 },
  { period: 'Week 2', score: 4.1 },
  { period: 'Week 3', score: 3.9 },
  { period: 'Week 4', score: 4.2 },
];

export default function CSATReportsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedProject, setSelectedProject] = useState('all');

  return (
    <PageContainer>
      <PageHeader
        title="CSAT Reports"
        description="Analyze customer satisfaction trends and insights."
        breadcrumbs={[
          { label: 'Reports', href: '/app/reports/csat' },
          { label: 'CSAT' },
        ]}
      >
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </PageHeader>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="space-y-6"
      >
        {/* Overview Metrics */}
        <motion.div
          variants={staggerContainerVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">Overall CSAT</p>
                  <BarChart3 className="h-5 w-5 text-neutral-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-3xl font-bold">
                    {overviewMetrics.overallCSAT}
                  </p>
                  <span className="text-sm text-neutral-500">/ 5</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {overviewMetrics.csatChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      overviewMetrics.csatChange >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {Math.abs(overviewMetrics.csatChange)}%
                  </span>
                  <span className="text-sm text-neutral-500">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">Total Responses</p>
                  <TrendingUp className="h-5 w-5 text-neutral-400" />
                </div>
                <p className="mt-2 text-3xl font-bold">
                  {overviewMetrics.totalResponses.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {overviewMetrics.responsesChange}%
                  </span>
                  <span className="text-sm text-neutral-500">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">Response Rate</p>
                  <TrendingDown className="h-5 w-5 text-neutral-400" />
                </div>
                <p className="mt-2 text-3xl font-bold">
                  {overviewMetrics.responseRate}%
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    {Math.abs(overviewMetrics.responseRateChange)}%
                  </span>
                  <span className="text-sm text-neutral-500">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">NPS Score</p>
                  <Badge variant="secondary">Beta</Badge>
                </div>
                <p className="mt-2 text-3xl font-bold">{overviewMetrics.nps}</p>
                <div className="mt-2 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {overviewMetrics.npsChange} pts
                  </span>
                  <span className="text-sm text-neutral-500">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Score Distribution */}
          <motion.div variants={staggerItemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>
                  Breakdown of responses by rating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoreDistribution.map((item) => (
                  <div key={item.score} className="flex items-center gap-4">
                    <div className="w-8 text-center font-medium">
                      {item.score}
                    </div>
                    <div className="flex-1">
                      <Progress value={item.percentage} className="h-3" />
                    </div>
                    <div className="w-20 text-right text-sm text-neutral-500">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Trend Chart */}
          <motion.div variants={staggerItemVariants}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>CSAT Trend</CardTitle>
                <CardDescription>
                  Score changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-neutral-300" />
                    <p className="mt-2 text-neutral-500">
                      Chart visualization coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Project Breakdown */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Breakdown</CardTitle>
                  <CardDescription>
                    CSAT scores by project
                  </CardDescription>
                </div>
                <Select
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projectBreakdown.map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {projectBreakdown.map((project) => (
                  <Link
                    key={project.name}
                    href={`/app/projects/1/overview`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-neutral-500">
                        {project.responses.toLocaleString()} responses
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xl font-bold">{project.score}</p>
                        <div className="flex items-center gap-1">
                          {project.change >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-500" />
                          )}
                          <span
                            className={`text-xs ${
                              project.change >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {Math.abs(project.change)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-24">
                        <Progress value={project.score * 20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
