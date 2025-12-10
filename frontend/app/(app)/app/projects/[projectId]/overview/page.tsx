'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MetricCard } from '@/components/domain/metric-card';

// Required for static export
export function generateStaticParams() {
  return [];
}
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const metrics = [
  {
    title: 'CSAT Score',
    value: '4.5',
    change: 12,
    changeLabel: 'vs last period',
    icon: Target,
  },
  {
    title: 'Total Responses',
    value: '12,543',
    change: 23,
    changeLabel: 'vs last period',
    icon: MessageSquare,
  },
  {
    title: 'Response Rate',
    value: '34%',
    change: -3,
    changeLabel: 'vs last period',
    icon: TrendingUp,
  },
  {
    title: 'Avg Response Time',
    value: '2.3s',
    change: 8,
    changeLabel: 'faster',
    icon: Clock,
  },
];

const csatDistribution = [
  { score: 5, count: 5234, percentage: 42 },
  { score: 4, count: 3821, percentage: 30 },
  { score: 3, count: 2156, percentage: 17 },
  { score: 2, count: 876, percentage: 7 },
  { score: 1, count: 456, percentage: 4 },
];

const topMoments = [
  { name: 'After Purchase', score: 4.8, responses: 2341 },
  { name: 'Onboarding Complete', score: 4.6, responses: 1856 },
  { name: 'Feature Discovery', score: 4.2, responses: 1234 },
  { name: 'Support Interaction', score: 3.9, responses: 3421 },
];

const personaInsights = [
  { name: 'Power Users', score: 4.7, percentage: 25 },
  { name: 'New Users', score: 4.2, percentage: 35 },
  { name: 'Casual Users', score: 4.4, percentage: 30 },
  { name: 'Enterprise', score: 4.8, percentage: 10 },
];

const csatColors = {
  5: 'bg-green-500',
  4: 'bg-lime-500',
  3: 'bg-yellow-500',
  2: 'bg-orange-500',
  1: 'bg-red-500',
};

export default function ProjectOverviewPage() {
  return (
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

      <div className="grid gap-8 lg:grid-cols-2">
        {/* CSAT Distribution */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {csatDistribution.map((item) => (
                  <div key={item.score} className="flex items-center gap-4">
                    <div className="w-8 text-center">
                      <Badge
                        className={`${csatColors[item.score as keyof typeof csatColors]} text-white`}
                      >
                        {item.score}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <Progress value={item.percentage} />
                    </div>
                    <div className="w-20 text-right text-sm text-neutral-500">
                      {item.count.toLocaleString()}
                    </div>
                    <div className="w-12 text-right text-sm font-medium">
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Moments */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Moments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMoments.map((moment, index) => (
                  <div
                    key={moment.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-neutral-400">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {moment.name}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {moment.responses.toLocaleString()} responses
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-neutral-900">
                        {moment.score}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>+0.2</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Persona Insights */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Persona Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personaInsights.map((persona) => (
                  <div
                    key={persona.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {persona.name}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {persona.percentage}% of responses
                        </p>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-neutral-900">
                      {persona.score}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trend Chart Placeholder */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CSAT Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                <div className="text-center text-neutral-400">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Trend chart placeholder</p>
                  <p className="text-xs">Integrate with Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
