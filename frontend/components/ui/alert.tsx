import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Alert Component
 *
 * Displays a callout for user attention with different severity levels.
 */

const alertVariants = cva(
  [
    'relative w-full rounded-lg border p-4',
    '[&>svg~*]:pl-7',
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  ],
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        info: 'bg-accent-50 text-accent-900 border-accent-200 [&>svg]:text-accent-600',
        success: 'bg-success-50 text-success-900 border-success-200 [&>svg]:text-success-600',
        warning: 'bg-warning-50 text-warning-900 border-warning-200 [&>svg]:text-warning-600',
        danger: 'bg-danger-50 text-danger-900 border-danger-200 [&>svg]:text-danger-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const alertIcons = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
};

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'default',
      showIcon = true,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const Icon = alertIcons[variant || 'default'];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && <Icon className="h-4 w-4" />}
        {children}
        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              'absolute right-2 top-2 rounded-md p-1',
              'opacity-70 ring-offset-background transition-opacity',
              'hover:opacity-100',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

// Banner variant for page-level alerts
const AlertBanner: React.FC<{
  variant?: 'info' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}> = ({ variant = 'info', children, dismissible, onDismiss }) => {
  const bgColors = {
    info: 'bg-accent-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };

  return (
    <div
      className={cn(
        'w-full px-4 py-3 text-white text-sm text-center relative',
        bgColors[variant]
      )}
      role="alert"
    >
      {children}
      {dismissible && (
        <button
          onClick={onDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription, AlertBanner, alertVariants };
