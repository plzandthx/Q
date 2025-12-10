'use client';

import { motion } from 'framer-motion';
import { Plus, MoreVertical, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MomentCard } from '@/components/domain/moment-card';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const moments = [
  {
    id: '1',
    name: 'After Purchase',
    description: 'Survey shown after completing a purchase',
    trigger: 'event:purchase_complete',
    score: 4.8,
    responses: 2341,
    trend: 0.3,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Onboarding Complete',
    description: 'Survey after user completes onboarding flow',
    trigger: 'event:onboarding_complete',
    score: 4.6,
    responses: 1856,
    trend: 0.1,
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Feature Discovery',
    description: 'Survey when user discovers a key feature',
    trigger: 'page:/features/*',
    score: 4.2,
    responses: 1234,
    trend: -0.2,
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Support Interaction',
    description: 'Survey after support ticket resolution',
    trigger: 'event:ticket_resolved',
    score: 3.9,
    responses: 3421,
    trend: 0.5,
    status: 'active' as const,
  },
  {
    id: '5',
    name: 'Checkout Flow',
    description: 'Survey during checkout process',
    trigger: 'page:/checkout',
    score: 4.1,
    responses: 892,
    trend: -0.1,
    status: 'paused' as const,
  },
];

export function MomentsClient() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="space-y-6"
    >
      {/* Header Actions */}
      <motion.div
        variants={staggerItemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Moments That Matter
          </h2>
          <p className="text-sm text-neutral-500">
            Track satisfaction at critical touchpoints in the customer journey
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Moment
        </Button>
      </motion.div>

      {/* Moments Grid */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {moments.map((moment) => (
          <motion.div key={moment.id} variants={staggerItemVariants}>
            <MomentCard
              name={moment.name}
              description={moment.description}
              trigger={moment.trigger}
              score={moment.score}
              responses={moment.responses}
              trend={moment.trend}
              status={moment.status}
              actions={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                    <DropdownMenuItem>
                      {moment.status === 'active' ? 'Pause' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Tips Card */}
      <motion.div variants={staggerItemVariants}>
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <Target className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">
                  Best practices for Moments That Matter
                </h3>
                <ul className="mt-2 text-sm text-neutral-600 space-y-1">
                  <li>Focus on high-impact touchpoints like purchases, support, and onboarding</li>
                  <li>Limit surveys to avoid fatigue - aim for 1 survey per user session</li>
                  <li>Use specific triggers for better targeting and higher response rates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
