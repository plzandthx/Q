import * as React from 'react';
import { TrendingUp, TrendingDown, MessageSquare, Plug } from 'lucide-react';
import { cn, formatScore, formatCompact } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Moment Card Component
 *
 * Displays a "Moment That Matters" with CSAT score and related info.
 */

export interface MomentCardProps {
  id?: string;
  name: string;
  description?: string | null;
  iconEmoji?: string | null;
  trigger?: string;
  csatScore?: number | null;
  score?: number | null; // alias for csatScore
  csatTrend?: number | null;
  trend?: number | null; // alias for csatTrend
  responsesCount?: number;
  responses?: number; // alias for responsesCount
  status?: 'active' | 'paused';
  hasIntegrations?: boolean;
  hasWidgets?: boolean;
  personaNames?: string[];
  actions?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const MomentCard: React.FC<MomentCardProps> = ({
  name,
  description,
  iconEmoji,
  trigger,
  csatScore,
  score,
  csatTrend,
  trend,
  responsesCount,
  responses,
  status,
  hasIntegrations = false,
  hasWidgets = false,
  personaNames = [],
  actions,
  onClick,
  selected = false,
  className,
}) => {
  // Support aliases
  const displayScore = csatScore ?? score;
  const displayTrend = csatTrend ?? trend;
  const displayResponses = responsesCount ?? responses ?? 0;
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
    <Card
      variant={onClick ? 'interactive' : 'elevated'}
      padding="md"
      className={cn(
        selected && 'ring-2 ring-primary',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Icon or emoji */}
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
          {iconEmoji || '🎯'}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <h4 className="font-medium truncate">{name}</h4>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center flex-wrap gap-2 mt-3">
            {/* Responses count */}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {formatCompact(displayResponses)} responses
            </span>

            {/* Trigger */}
            {trigger && (
              <span className="text-xs text-muted-foreground font-mono">
                {trigger}
              </span>
            )}

            {/* Status badge */}
            {status && (
              <Badge variant={status === 'active' ? 'success' : 'secondary'} size="sm">
                {status}
              </Badge>
            )}

            {/* Integration indicator */}
            {hasIntegrations && (
              <Badge variant="outline" size="sm">
                <Plug className="h-3 w-3 mr-1" />
                Integrated
              </Badge>
            )}

            {/* Widget indicator */}
            {hasWidgets && (
              <Badge variant="outline" size="sm">
                Widget
              </Badge>
            )}
          </div>

          {/* Personas */}
          {personaNames.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {personaNames.slice(0, 3).map((persona, i) => (
                <Badge key={i} variant="secondary" size="sm">
                  {persona}
                </Badge>
              ))}
              {personaNames.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{personaNames.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}

        {/* CSAT Score */}
        {displayScore !== null && displayScore !== undefined && (
          <div className="flex-shrink-0 text-right">
            <div
              className={cn(
                'inline-flex items-center justify-center h-12 w-12 rounded-lg text-lg font-bold',
                getCsatBgColor(displayScore),
                getCsatColor(displayScore)
              )}
            >
              {formatScore(displayScore, 1)}
            </div>
            {displayTrend !== null && displayTrend !== undefined && (
              <div
                className={cn(
                  'flex items-center justify-center gap-0.5 text-xs mt-1',
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
                  {formatScore(displayTrend, 1)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Compact chip variant for inline use
const MomentChip: React.FC<{
  name: string;
  iconEmoji?: string | null;
  csatScore?: number | null;
  onClick?: () => void;
  className?: string;
}> = ({ name, iconEmoji, csatScore, onClick, className }) => {
  const getCsatColor = (score: number) => {
    if (score >= 4) return 'bg-success/10 text-success';
    if (score >= 3) return 'bg-warning/10 text-warning';
    return 'bg-danger/10 text-danger';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
        'bg-muted hover:bg-muted/80 transition-colors',
        'text-sm font-medium',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <span>{iconEmoji || '🎯'}</span>
      <span>{name}</span>
      {csatScore !== null && csatScore !== undefined && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded text-xs font-semibold',
            getCsatColor(csatScore)
          )}
        >
          {formatScore(csatScore, 1)}
        </span>
      )}
    </button>
  );
};

// Skeleton loading state
const MomentCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card padding="md" className={className}>
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </Card>
  );
};

export { MomentCard, MomentChip, MomentCardSkeleton };
