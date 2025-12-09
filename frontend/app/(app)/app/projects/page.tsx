'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { PageContainer, PageHeader } from '@/components/layout';
import { ProjectCard } from '@/components/domain/project-card';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const projects = [
  {
    id: '1',
    name: 'Mobile App',
    description: 'iOS and Android app feedback',
    score: 4.5,
    responses: 12543,
    responsesTrend: 23,
    moments: 8,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Web Dashboard',
    description: 'SaaS dashboard experience',
    score: 4.1,
    responses: 8562,
    responsesTrend: 15,
    moments: 5,
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Customer Support',
    description: 'Support ticket satisfaction',
    score: 3.8,
    responses: 23412,
    responsesTrend: -5,
    moments: 12,
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Checkout Flow',
    description: 'E-commerce checkout experience',
    score: 4.3,
    responses: 5621,
    responsesTrend: 8,
    moments: 4,
    status: 'active' as const,
  },
  {
    id: '5',
    name: 'Onboarding',
    description: 'New user onboarding flow',
    score: 4.7,
    responses: 2134,
    responsesTrend: 42,
    moments: 6,
    status: 'active' as const,
  },
  {
    id: '6',
    name: 'Legacy Portal',
    description: 'Old customer portal (deprecated)',
    score: 3.2,
    responses: 432,
    responsesTrend: -12,
    moments: 3,
    status: 'inactive' as const,
  },
];

export default function ProjectsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Manage your CSAT projects and track satisfaction across products."
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
        className="space-y-6"
      >
        {/* Filters */}
        <motion.div
          variants={staggerItemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Projects</DropdownMenuItem>
                <DropdownMenuItem>Active Only</DropdownMenuItem>
                <DropdownMenuItem>Inactive Only</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort by: Score
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Score (High to Low)</DropdownMenuItem>
                <DropdownMenuItem>Score (Low to High)</DropdownMenuItem>
                <DropdownMenuItem>Responses (Most)</DropdownMenuItem>
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Recently Updated</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainerVariants}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={staggerItemVariants}>
              <ProjectCard
                name={project.name}
                description={project.description}
                score={project.score}
                responses={project.responses}
                responsesTrend={project.responsesTrend}
                moments={project.moments}
                status={project.status}
                href={`/app/projects/${project.id}/overview`}
                actions={
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/app/projects/${project.id}/overview`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/app/projects/${project.id}/settings`}>
                          Settings
                        </Link>
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

        {/* Empty State (hidden when projects exist) */}
        {projects.length === 0 && (
          <motion.div
            variants={staggerItemVariants}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="rounded-full bg-neutral-100 p-4 mb-4">
              <Plus className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">No projects yet</h3>
            <p className="mt-1 text-neutral-600 max-w-sm">
              Create your first project to start collecting customer feedback and
              tracking satisfaction.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/app/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  );
}
