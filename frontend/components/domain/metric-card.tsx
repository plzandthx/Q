import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatScore, formatCompact, formatPercent } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { SimpleTooltip, TooltipProvider } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Metric Card Component
 *
 * Displays a single KPI with optional trend indicator.
 * Used for dashboard overview statistics.
 */

export interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  format?: 'number' | 'percent' | 'score' | 'compact';
  icon?: React.ReactNode;
  tooltip?: string;
  loading?: boolean;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  delta,
  deltaLabel = 'vs last period',
  format = 'number',
  icon,
  tooltip,
  loading = false,
  className,
}) => {
  // Format value based on type
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'percent':
        return formatPercent(val);
      case 'score':
        return formatScore(val);
      case 'compact':
        return formatCompact(val);
      default:
        return val.toLocaleString();
    }
  };

  // Determine trend direction
  const getTrendInfo = () => {
    if (delta === undefined || delta === 0) {
      return { direction: 'neutral' as const, Icon: Minus, color: 'text-muted-foreground' };
    }
    if (delta > 0) {
      return { direction: 'up' as const, Icon: TrendingUp, color: 'text-success' };
    }
    return { direction: 'down' as const, Icon: TrendingDown, color: 'text-danger' };
  };

  const trend = delta !== undefined ? getTrendInfo() : null;

  if (loading) {
    return (
      <Card padding="md" className={className}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Card>
    );
  }

  const content = (
    <Card padding="md" className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight">
          {formatValue(value)}
        </span>
        {format === 'score' && (
          <span className="text-lg text-muted-foreground">/ 5</span>
        )}
      </div>

      {trend && (
        <div className={cn('flex items-center gap-1 text-sm', trend.color)}>
          <trend.Icon className="h-4 w-4" />
          <span>
            {delta! > 0 ? '+' : ''}
            {format === 'percent'
              ? `${delta!.toFixed(1)}pp`
              : formatScore(delta!)}
          </span>
          <span className="text-muted-foreground ml-1">{deltaLabel}</span>
        </div>
      )}
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <SimpleTooltip content={tooltip}>{content}</SimpleTooltip>
      </TooltipProvider>
    );
  }

  return content;
};

// CSAT-specific metric card with score coloring
const CsatMetricCard: React.FC<
  Omit<MetricCardProps, 'format'> & {
    score: number;
  }
> = ({ score, ...props }) => {
  // Color based on CSAT score
  const getScoreColor = (s: number) => {
    if (s >= 4) return 'text-success';
    if (s >= 3) return 'text-warning';
    return 'text-danger';
  };

  return (
    <Card padding="md" className={cn('space-y-2', props.className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{props.label}</span>
        {props.icon && <span className="text-muted-foreground">{props.icon}</span>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={cn('text-3xl font-semibold tracking-tight', getScoreColor(score))}>
          {formatScore(score)}
        </span>
        <span className="text-lg text-muted-foreground">/ 5</span>
      </div>

      {props.delta !== undefined && (
        <div
          className={cn(
            'flex items-center gap-1 text-sm',
            props.delta > 0 ? 'text-success' : props.delta < 0 ? 'text-danger' : 'text-muted-foreground'
          )}
        >
          {props.delta > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : props.delta < 0 ? (
            <TrendingDown className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
          <span>
            {props.delta > 0 ? '+' : ''}
            {formatScore(props.delta)}
          </span>
          <span className="text-muted-foreground ml-1">
            {props.deltaLabel || 'vs last period'}
          </span>
        </div>
      )}
    </Card>
  );
};

export { MetricCard, CsatMetricCard };
