import * as React from 'react';
import Link from 'next/link';
import {
  MoreHorizontal,
  Users,
  Milestone,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn, formatScore } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Project Card Component
 *
 * Displays a project in a list or grid view with key metrics.
 */

export interface ProjectCardProps {
  id?: string;
  name: string;
  description?: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  csatScore?: number | null;
  score?: number | null; // alias for csatScore
  csatTrend?: number | null;
  responses?: number;
  responsesTrend?: number;
  personaCount?: number;
  momentCount?: number;
  moments?: number; // alias for momentCount
  widgetCount?: number;
  href?: string;
  actions?: React.ReactNode;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  status,
  csatScore,
  score,
  csatTrend,
  responses,
  responsesTrend,
  personaCount = 0,
  momentCount,
  moments,
  widgetCount = 0,
  href,
  actions,
  onEdit,
  onArchive,
  onDelete,
  className,
}) => {
  // Support aliases
  const displayScore = csatScore ?? score;
  const displayTrend = csatTrend ?? responsesTrend;
  const displayMoments = momentCount ?? moments ?? 0;
  const linkHref = href || (id ? `/app/projects/${id}` : '#');
  const getCsatColor = (score: number) => {
    if (score >= 4) return 'text-success';
    if (score >= 3) return 'text-warning';
    return 'text-danger';
  };

  return (
    <Card variant="interactive" padding="none" className={cn('relative', className)}>
      <Link href={linkHref} className="block p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{name}</h3>
              <StatusBadge status={status} />
            </div>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {description}
              </p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {personaCount} personas
              </span>
              <span className="flex items-center gap-1">
                <Milestone className="h-4 w-4" />
                {displayMoments} moments
              </span>
              {responses !== undefined && (
                <span className="flex items-center gap-1">
                  {responses.toLocaleString()} responses
                </span>
              )}
              <span className="flex items-center gap-1">
                <LayoutGrid className="h-4 w-4" />
                {widgetCount} widgets
              </span>
            </div>
          </div>

          {/* CSAT score */}
          {displayScore !== null && displayScore !== undefined && (
            <div className="text-right shrink-0">
              <div className={cn('text-2xl font-bold', getCsatColor(displayScore))}>
                {formatScore(displayScore)}
              </div>
              <div className="text-xs text-muted-foreground">CSAT</div>
              {displayTrend !== null && displayTrend !== undefined && (
                <div
                  className={cn(
                    'flex items-center justify-end gap-0.5 text-xs mt-1',
                    displayTrend > 0 ? 'text-success' : displayTrend < 0 ? 'text-danger' : 'text-muted-foreground'
                  )}
                >
                  {displayTrend > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : displayTrend < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  <span>
                    {displayTrend > 0 ? '+' : ''}
                    {displayTrend}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Custom actions or default dropdown menu */}
      {actions ? (
        <div className="absolute top-4 right-4">
          {actions}
        </div>
      ) : (onEdit || onArchive || onDelete) ? (
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={onArchive}>
                  {status === 'ACTIVE' ? 'Archive' : 'Unarchive'}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} variant="danger">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </Card>
  );
};

// Skeleton loading state
const ProjectCardSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <Card padding="md" className={className}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="text-right">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-3 w-8 mt-1" />
        </div>
      </div>
    </Card>
  );
};

export { ProjectCard, ProjectCardSkeleton };
