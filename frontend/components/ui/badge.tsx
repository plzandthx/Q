import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge Component
 *
 * Small labels for status, plans, roles, and other categorical information.
 */

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center gap-1',
    'rounded-full px-2.5 py-0.5',
    'text-xs font-medium',
    'whitespace-nowrap',
    'transition-colors duration-200',
  ],
  {
    variants: {
      variant: {
        // Default neutral badge
        default: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
        // Primary teal
        primary: 'bg-primary-100 text-primary-700 border border-primary-200',
        // Secondary gray
        secondary: 'bg-secondary text-secondary-foreground border border-neutral-200',
        // Status: Success
        success: 'bg-success-100 text-success-700 border border-success-200',
        // Status: Warning
        warning: 'bg-warning-100 text-warning-700 border border-warning-200',
        // Status: Danger
        danger: 'bg-danger-100 text-danger-700 border border-danger-200',
        // Outline variants
        outline: 'bg-transparent text-foreground border border-border',
        'outline-primary': 'bg-transparent text-primary border border-primary',
        // Solid variants
        'solid-primary': 'bg-primary text-primary-foreground',
        'solid-success': 'bg-success text-success-foreground',
        'solid-warning': 'bg-warning text-warning-foreground',
        'solid-danger': 'bg-danger text-danger-foreground',
      },
      size: {
        sm: 'text-[10px] px-2 py-0',
        md: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {leftIcon && <span className="[&_svg]:size-3">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="[&_svg]:size-3">{rightIcon}</span>}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Preset badges for common use cases
const PlanBadge: React.FC<{ plan: string }> = ({ plan }) => {
  const variant = {
    FREE: 'default',
    GROWTH: 'primary',
    SCALE: 'solid-primary',
    ENTERPRISE: 'solid-primary',
  }[plan.toUpperCase()] || 'default';

  return <Badge variant={variant as any}>{plan}</Badge>;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalizedStatus = status.toUpperCase();
  const variant = {
    ACTIVE: 'success',
    CONNECTED: 'success',
    ARCHIVED: 'secondary',
    DISCONNECTED: 'secondary',
    ERROR: 'danger',
    PENDING: 'warning',
    TRIALING: 'primary',
  }[normalizedStatus] || 'default';

  return <Badge variant={variant as any}>{status}</Badge>;
};

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const variant = {
    OWNER: 'solid-primary',
    ADMIN: 'primary',
    MEMBER: 'default',
    VIEWER: 'secondary',
  }[role.toUpperCase()] || 'default';

  return <Badge variant={variant as any}>{role}</Badge>;
};

export { Badge, badgeVariants, PlanBadge, StatusBadge, RoleBadge };
