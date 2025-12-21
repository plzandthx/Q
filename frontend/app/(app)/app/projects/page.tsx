'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Milestone, LayoutGrid, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { cn, formatScore, formatCompact } from '@/lib/utils';

// Enhanced project data structure
interface Project {
  id: string;
  name: string;
  description: string;
  score: number;
  responses: number;
  responsesTrend: number;
  moments: number;
  widgets: number;
  integrations: number;
  status: 'ACTIVE' | 'ARCHIVED';
  lastUpdated: string;
}

// Mock data with enhanced structure
const projects: Project[] = [
  {
    id: '1',
    name: 'Mobile App',
    description: 'iOS and Android app feedback',
    score: 4.5,
    responses: 12543,
    responsesTrend: 23,
    moments: 8,
    widgets: 5,
    integrations: 3,
    status: 'ACTIVE',
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    name: 'Web Dashboard',
    description: 'SaaS dashboard experience',
    score: 4.1,
    responses: 8562,
    responsesTrend: 15,
    moments: 5,
    widgets: 3,
    integrations: 2,
    status: 'ACTIVE',
    lastUpdated: '5 hours ago',
  },
  {
    id: '3',
    name: 'Customer Support',
    description: 'Support ticket satisfaction',
    score: 3.8,
    responses: 23412,
    responsesTrend: -5,
    moments: 12,
    widgets: 8,
    integrations: 4,
    status: 'ACTIVE',
    lastUpdated: '1 day ago',
  },
  {
    id: '4',
    name: 'Checkout Flow',
    description: 'E-commerce checkout experience',
    score: 4.3,
    responses: 5621,
    responsesTrend: 8,
    moments: 4,
    widgets: 2,
    integrations: 1,
    status: 'ACTIVE',
    lastUpdated: '3 days ago',
  },
  {
    id: '5',
    name: 'Onboarding',
    description: 'New user onboarding flow',
    score: 4.7,
    responses: 2134,
    responsesTrend: 42,
    moments: 6,
    widgets: 4,
    integrations: 2,
    status: 'ACTIVE',
    lastUpdated: '1 week ago',
  },
  {
    id: '6',
    name: 'Legacy Portal',
    description: 'Old customer portal (deprecated)',
    score: 3.2,
    responses: 432,
    responsesTrend: -12,
    moments: 3,
    widgets: 1,
    integrations: 0,
    status: 'ARCHIVED',
    lastUpdated: '2 weeks ago',
  },
];

// Enhanced Project Card Component
function ProjectCard({ project }: { project: Project }) {
  const getCsatColor = (score: number) => {
    if (score >= 4) return 'text-success';
    if (score >= 3) return 'text-warning';
    return 'text-danger';
  };

  const getCsatBgColor = (score: number) => {
    if (score >= 4) return 'bg-success/10';
    if (score >= 3) return 'bg-warning/10';
    return 'bg-danger/10';
  };

  return (
    <Card variant="interactive" padding="none" className="relative overflow-hidden">
      <Link href={`/app/projects/${project.id}/overview`} className="block">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                <Badge
                  variant={project.status === 'ACTIVE' ? 'success' : 'secondary'}
                  size="sm"
                >
                  {project.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {project.description}
              </p>
            </div>

            {/* CSAT Score */}
            <div className="text-right shrink-0">
              <div
                className={cn(
                  'inline-flex items-center justify-center h-14 w-14 rounded-xl text-xl font-bold',
                  getCsatBgColor(project.score),
                  getCsatColor(project.score)
                )}
              >
                {formatScore(project.score, 1)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">CSAT</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">{formatCompact(project.responses)}</p>
              <p className="text-xs text-muted-foreground">Responses</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Milestone className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">{project.moments}</p>
              <p className="text-xs text-muted-foreground">Moments</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">{project.widgets}</p>
              <p className="text-xs text-muted-foreground">Widgets</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              {project.responsesTrend !== 0 && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    project.responsesTrend > 0 ? 'text-success' : 'text-danger'
                  )}
                >
                  {project.responsesTrend > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {project.responsesTrend > 0 ? '+' : ''}
                    {project.responsesTrend}%
                  </span>
                </div>
              )}
              {project.integrations > 0 && (
                <Badge variant="outline" size="sm">
                  {project.integrations} integrations
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Updated {project.lastUpdated}
            </span>
          </div>
        </CardContent>
      </Link>

      {/* Actions Dropdown */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/app/projects/${project.id}/overview`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/app/projects/${project.id}/moments`}>
                Manage Moments
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/app/projects/${project.id}/settings`}>
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

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
            New project
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
                <DropdownMenuItem>Archived Only</DropdownMenuItem>
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

        {/* Summary Stats */}
        <motion.div
          variants={staggerItemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">
                {projects.filter((p) => p.status === 'ACTIVE').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">
                {formatCompact(projects.reduce((sum, p) => sum + p.responses, 0))}
              </p>
              <p className="text-sm text-muted-foreground">Total Responses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">
                {formatScore(
                  projects.reduce((sum, p) => sum + p.score, 0) / projects.length,
                  1
                )}
              </p>
              <p className="text-sm text-muted-foreground">Avg CSAT Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary-600">
                {projects.reduce((sum, p) => sum + p.moments, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Moments</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainerVariants}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={staggerItemVariants}>
              <ProjectCard project={project} />
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
                Create project
              </Link>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  );
}
