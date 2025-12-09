import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Page Container Components
 *
 * Layout primitives for consistent page structure.
 */

// Main page container with horizontal padding and max width
const PageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}> = ({ children, className, size = 'lg' }) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8 py-6',
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  );
};

// Narrow container for focused content (forms, settings, etc.)
const NarrowContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('mx-auto w-full max-w-2xl px-4 py-6', className)}>
      {children}
    </div>
  );
};

// Two-column layout (e.g., list + detail, sidebar + content)
const TwoColumnLayout: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ left, right, leftWidth = 'md', className }) => {
  const leftWidths = {
    sm: 'lg:w-64',
    md: 'lg:w-80',
    lg: 'lg:w-96',
  };

  return (
    <div className={cn('flex flex-col lg:flex-row gap-6', className)}>
      <div className={cn('shrink-0', leftWidths[leftWidth])}>{left}</div>
      <div className="flex-1 min-w-0">{right}</div>
    </div>
  );
};

// Grid layout for cards
const CardsGrid: React.FC<{
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}> = ({ children, columns = 3, className }) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', columnClasses[columns], className)}>
      {children}
    </div>
  );
};

// Stats grid for dashboard metrics
const StatsGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
};

// Divider with optional label
const Divider: React.FC<{
  label?: string;
  className?: string;
}> = ({ label, className }) => {
  if (label) {
    return (
      <div className={cn('relative', className)}>
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return <div className={cn('border-t border-border', className)} />;
};

export {
  PageContainer,
  NarrowContainer,
  TwoColumnLayout,
  CardsGrid,
  StatsGrid,
  Divider,
};
