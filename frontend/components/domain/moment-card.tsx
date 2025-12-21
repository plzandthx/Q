import * as React from 'react';
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  CheckCircle2,
  Pause,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { cn, formatScore, formatCompact } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/ui/logo';

/**
 * Moment Card Component
 *
 * Displays a "Moment That Matters" with CSAT score and related info.
 */

export interface CsatWidgetInfo {
  id: string;
  name: string;
  type: 'custom' | 'integration';
  status: 'connected' | 'paused' | 'issue';
  integrationIcon?: string;
}

export interface FeedbackIntegration {
  id: string;
  name: string;
  icon: string;
}

export interface InsightsAutomation {
  id: string;
  name: string;
  icon: string;
}

export interface MomentCardProps {
  id?: string;
  name: string;
  description?: string | null;
  iconEmoji?: string | null;
  csatScore?: number | null;
  score?: number | null; // alias for csatScore
  csatTrend?: number | null;
  trend?: number | null; // alias for csatTrend
  responsesCount?: number;
  responses?: number; // alias for responsesCount
  status?: 'active' | 'paused';
  // New fields for CSAT Widget, Feedback Integrations, and Insights Automation
  csatWidget?: CsatWidgetInfo;
  feedbackIntegrations?: FeedbackIntegration[];
  insightsAutomation?: InsightsAutomation;
  // Deprecated - kept for backward compatibility
  trigger?: string;
  hasIntegrations?: boolean;
  hasWidgets?: boolean;
  personaNames?: string[];
  // Actions
  actions?: React.ReactNode;
  onEdit?: () => void;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const MomentCard: React.FC<MomentCardProps> = ({
  name,
  description,
  iconEmoji,
  csatScore,
  score,
  csatTrend,
  trend,
  responsesCount,
  responses,
  status,
  csatWidget,
  feedbackIntegrations = [],
  insightsAutomation,
  actions,
  onEdit,
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

  const getWidgetStatusBadge = (widgetStatus: CsatWidgetInfo['status']) => {
    switch (widgetStatus) {
      case 'connected':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="secondary" size="sm">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case 'issue':
        return (
          <Badge variant="danger" size="sm">
            <AlertCircle className="h-3 w-3 mr-1" />
            Issue
          </Badge>
        );
    }
  };

  return (
    <Card
      variant={onClick ? 'interactive' : 'elevated'}
      padding="md"
      className={cn(selected && 'ring-2 ring-primary', className)}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Icon or emoji */}
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
          {iconEmoji || '🎯'}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{name}</h4>
            {/* Status badge */}
            {status && (
              <Badge variant={status === 'active' ? 'success' : 'secondary'} size="sm">
                {status}
              </Badge>
            )}
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {description}
            </p>
          )}

          {/* Responses count */}
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {formatCompact(displayResponses)} responses
            </span>
          </div>

          {/* CSAT Widget Section */}
          {csatWidget && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                CSAT Widget
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-primary-100 flex items-center justify-center">
                    {csatWidget.type === 'custom' ? (
                      <Logo size="xs" />
                    ) : (
                      <span className="text-xs font-bold text-neutral-600">
                        {csatWidget.integrationIcon || csatWidget.name[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{csatWidget.name}</span>
                  {getWidgetStatusBadge(csatWidget.status)}
                </div>
              </div>
            </div>
          )}

          {/* Feedback Integrations Section */}
          {feedbackIntegrations.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Feedback Integrations
              </div>
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {feedbackIntegrations.slice(0, 4).map((integration) => (
                    <div
                      key={integration.id}
                      className="h-7 w-7 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center"
                      title={integration.name}
                    >
                      <span className="text-xs font-bold text-neutral-600">
                        {integration.icon}
                      </span>
                    </div>
                  ))}
                  {feedbackIntegrations.length > 4 && (
                    <div className="h-7 w-7 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium text-neutral-600">
                        +{feedbackIntegrations.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Insights Automation Section */}
          {insightsAutomation && (
            <div className="mt-3">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Insights Automation
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-neutral-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-neutral-600">
                    {insightsAutomation.icon}
                  </span>
                </div>
                <span className="text-sm">{insightsAutomation.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          {/* CSAT Score */}
          {displayScore !== null && displayScore !== undefined && (
            <div className="text-right">
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
                    displayTrend > 0
                      ? 'text-success'
                      : displayTrend < 0
                      ? 'text-danger'
                      : 'text-muted-foreground'
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

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {actions}
          </div>
        </div>
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
          </div>
          <div className="pt-2">
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </Card>
  );
};

export { MomentCard, MomentChip, MomentCardSkeleton };
