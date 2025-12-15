import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button Component
 *
 * A flexible button component with multiple variants, sizes, and states.
 * Built on top of Radix UI's Slot for composition support.
 *
 * @example
 * // Primary button
 * <Button>Click me</Button>
 *
 * // Secondary button with loading state
 * <Button variant="secondary" loading>Processing...</Button>
 *
 * // Icon button
 * <Button variant="ghost" size="icon"><ChevronRight /></Button>
 *
 * // As a link
 * <Button asChild><Link href="/about">About</Link></Button>
 */

const buttonVariants = cva(
  // Base styles applied to all buttons
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-lg',
    'text-sm font-medium',
    'ring-offset-background',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    // Allow shrinking for icon-only buttons
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Primary - for main CTAs
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary-600',
          'active:bg-primary-700',
          'shadow-sm hover:shadow-primary',
        ],
        // Secondary - for secondary actions (visible gray with border)
        secondary: [
          'bg-neutral-100 text-neutral-900',
          'hover:bg-neutral-200',
          'active:bg-neutral-300',
          'border border-neutral-300',
        ],
        // Outline - bordered style
        outline: [
          'bg-transparent text-foreground',
          'border border-border',
          'hover:bg-neutral-100',
          'active:bg-neutral-200',
        ],
        // Ghost - minimal, no background
        ghost: [
          'bg-transparent text-foreground',
          'hover:bg-neutral-100',
          'active:bg-neutral-200',
        ],
        // Danger - for destructive actions
        danger: [
          'bg-danger text-danger-foreground',
          'hover:bg-danger-600',
          'active:bg-danger-700',
          'shadow-sm',
        ],
        // Danger outline - less prominent destructive
        'danger-outline': [
          'bg-transparent text-danger',
          'border border-danger/50',
          'hover:bg-danger-50 hover:border-danger',
          'active:bg-danger-100',
        ],
        // Link style - looks like a link
        link: [
          'bg-transparent text-primary underline-offset-4',
          'hover:underline',
          'p-0 h-auto',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        // Icon button - square
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, the button will render as a child element (useful for Links)
   */
  asChild?: boolean;
  /**
   * If true, shows a loading spinner and disables the button
   */
  loading?: boolean;
  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
