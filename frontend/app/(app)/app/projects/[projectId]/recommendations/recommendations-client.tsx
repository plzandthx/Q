'use client';

import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data (AI-generated recommendations)
const recommendations = [
  {
    id: '1',
    priority: 'high',
    title: 'Improve Support Response Time',
    description:
      'Users mentioning "slow response" have 40% lower CSAT scores. Consider implementing auto-responders or increasing support staff during peak hours.',
    impact: 'Could improve overall CSAT by 0.3 points',
    category: 'Support',
    status: 'new',
  },
  {
    id: '2',
    priority: 'high',
    title: 'Address Checkout Friction',
    description:
      'The checkout flow moment shows declining scores. Common themes include "too many steps" and "payment issues". Consider simplifying the checkout process.',
    impact: 'Could reduce cart abandonment by 15%',
    category: 'UX',
    status: 'new',
  },
  {
    id: '3',
    priority: 'medium',
    title: 'Enhance Mobile Experience',
    description:
      'Mobile users have 0.4 lower CSAT compared to desktop. Consider responsive design improvements and mobile-specific features.',
    impact: 'Could improve mobile CSAT by 0.4 points',
    category: 'Product',
    status: 'in_progress',
  },
  {
    id: '4',
    priority: 'low',
    title: 'Add Feature Tutorials',
    description:
      'New users discovering features have lower scores. Interactive tutorials could help improve onboarding satisfaction.',
    impact: 'Could improve new user CSAT by 0.2 points',
    category: 'Onboarding',
    status: 'completed',
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'low':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-neutral-100 text-neutral-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'in_progress':
      return <TrendingUp className="h-5 w-5 text-blue-500" />;
    default:
      return <Lightbulb className="h-5 w-5 text-yellow-500" />;
  }
};

export function RecommendationsClient() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              AI-Powered Recommendations
            </h2>
            <p className="text-sm text-neutral-500">
              Actionable insights based on your CSAT data analysis
            </p>
          </div>
          <Badge variant="secondary">
            <Lightbulb className="mr-1 h-3 w-3" />
            {recommendations.filter((r) => r.status === 'new').length} new
          </Badge>
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={staggerItemVariants}>
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700">Potential CSAT Improvement</p>
                <p className="text-3xl font-bold text-primary-900">+0.6 points</p>
                <p className="text-sm text-primary-600 mt-1">
                  If all high-priority recommendations are implemented
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-700">Implementation Progress</p>
                <p className="text-xl font-bold text-primary-900 mt-1">25%</p>
                <Progress value={25} className="mt-2 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations List */}
      <motion.div variants={staggerContainerVariants} className="space-y-4">
        {recommendations.map((rec) => (
          <motion.div key={rec.id} variants={staggerItemVariants}>
            <Card
              className={
                rec.status === 'completed' ? 'bg-neutral-50 opacity-75' : ''
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {getStatusIcon(rec.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className={`font-semibold ${
                          rec.status === 'completed'
                            ? 'text-neutral-500 line-through'
                            : 'text-neutral-900'
                        }`}
                      >
                        {rec.title}
                      </h3>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600">
                        {rec.impact}
                      </p>
                      {rec.status !== 'completed' && (
                        <Button variant="outline" size="sm">
                          {rec.status === 'in_progress'
                            ? 'View Progress'
                            : 'Take Action'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
