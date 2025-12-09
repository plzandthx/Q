import * as React from 'react';
import Link from 'next/link';
import {
  MoreHorizontal,
  Users,
  Milestone,
  Widget,
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
  id: string;
  name: string;
  description?: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  csatScore?: number | null;
  csatTrend?: number | null;
  personaCount?: number;
  momentCount?: number;
  widgetCount?: number;
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
  csatTrend,
  personaCount = 0,
  momentCount = 0,
  widgetCount = 0,
  onEdit,
  onArchive,
  onDelete,
  className,
}) => {
  const getCsatColor = (score: number) => {
    if (score >= 4) return 'text-success';
    if (score >= 3) return 'text-warning';
    return 'text-danger';
  };

  return (
    <Card variant="interactive" padding="none" className={className}>
      <Link href={`/app/projects/${id}`} className="block p-6">
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
                {momentCount} moments
              </span>
              <span className="flex items-center gap-1">
                <Widget className="h-4 w-4" />
                {widgetCount} widgets
              </span>
            </div>
          </div>

          {/* CSAT score */}
          {csatScore !== null && csatScore !== undefined && (
            <div className="text-right shrink-0">
              <div className={cn('text-2xl font-bold', getCsatColor(csatScore))}>
                {formatScore(csatScore)}
              </div>
              <div className="text-xs text-muted-foreground">CSAT</div>
              {csatTrend !== null && csatTrend !== undefined && (
                <div
                  className={cn(
                    'flex items-center justify-end gap-0.5 text-xs mt-1',
                    csatTrend > 0 ? 'text-success' : csatTrend < 0 ? 'text-danger' : 'text-muted-foreground'
                  )}
                >
                  {csatTrend > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : csatTrend < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  <span>
                    {csatTrend > 0 ? '+' : ''}
                    {formatScore(csatTrend)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Actions menu */}
      {(onEdit || onArchive || onDelete) && (
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
      )}
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
