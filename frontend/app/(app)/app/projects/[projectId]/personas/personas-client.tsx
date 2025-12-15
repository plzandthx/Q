'use client';

import { motion } from 'framer-motion';
import { Plus, Users, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const personas = [
  {
    id: '1',
    name: 'Power Users',
    description: 'Users who engage with advanced features regularly',
    criteria: 'sessions > 10/week AND feature_usage > 80%',
    score: 4.7,
    responses: 3124,
    percentage: 25,
    trend: 0.2,
    color: 'bg-purple-500',
  },
  {
    id: '2',
    name: 'New Users',
    description: 'Users in their first 30 days',
    criteria: 'account_age < 30 days',
    score: 4.2,
    responses: 4356,
    percentage: 35,
    trend: -0.1,
    color: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Casual Users',
    description: 'Users with moderate engagement',
    criteria: 'sessions 2-5/week',
    score: 4.4,
    responses: 3742,
    percentage: 30,
    trend: 0.1,
    color: 'bg-teal-500',
  },
  {
    id: '4',
    name: 'Enterprise',
    description: 'Users from enterprise accounts',
    criteria: 'plan = "enterprise"',
    score: 4.8,
    responses: 1245,
    percentage: 10,
    trend: 0.3,
    color: 'bg-amber-500',
  },
];

export function PersonasClient() {
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
            Customer Personas
          </h2>
          <p className="text-sm text-neutral-500">
            Segment feedback by customer type for deeper insights
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Persona
        </Button>
      </motion.div>

      {/* Personas Grid */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid gap-6 sm:grid-cols-2"
      >
        {personas.map((persona) => (
          <motion.div key={persona.id} variants={staggerItemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${persona.color} bg-opacity-20`}
                  >
                    <Users className={`h-6 w-6 ${persona.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {persona.name}
                    </h3>
                    <p className="text-sm text-neutral-500">{persona.description}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View analytics</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Criteria */}
                <div className="rounded-lg bg-neutral-50 px-3 py-2">
                  <p className="text-xs text-neutral-500">Criteria</p>
                  <code className="text-xs text-neutral-700">{persona.criteria}</code>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">
                      {persona.score}
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-neutral-500">CSAT</p>
                      {persona.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">
                      {persona.responses.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500">Responses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">
                      {persona.percentage}%
                    </p>
                    <p className="text-xs text-neutral-500">of Total</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <Progress value={persona.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Comparison Card */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Persona Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
              <div className="text-center text-neutral-400">
                <Users className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Comparison chart placeholder</p>
                <p className="text-xs">Compare CSAT across personas over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
