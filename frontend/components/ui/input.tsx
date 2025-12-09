import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input Component
 *
 * A styled text input with support for labels, descriptions, and error states.
 *
 * @example
 * // Basic input
 * <Input placeholder="Enter your email" />
 *
 * // With label and error
 * <Input
 *   label="Email"
 *   placeholder="you@example.com"
 *   error="Please enter a valid email"
 * />
 */

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text displayed above the input
   */
  label?: string;
  /**
   * Description/help text displayed below the label
   */
  description?: string;
  /**
   * Error message - displays in red and adds error styling
   */
  error?: string;
  /**
   * Left icon or element
   */
  leftElement?: React.ReactNode;
  /**
   * Right icon or element
   */
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      description,
      error,
      leftElement,
      rightElement,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}

        {/* Description */}
        {description && !hasError && (
          <p
            id={descriptionId}
            className="text-sm text-muted-foreground mb-1.5"
          >
            {description}
          </p>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left element */}
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftElement}
            </div>
          )}

          {/* Input */}
          <input
            type={type}
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-describedby={
              hasError ? errorId : description ? descriptionId : undefined
            }
            aria-invalid={hasError}
            className={cn(
              // Base styles
              'flex h-10 w-full rounded-lg border bg-background px-3 py-2',
              'text-sm placeholder:text-muted-foreground',
              'transition-colors duration-200',
              // Focus styles
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              // Disabled styles
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              // Border color based on state
              hasError
                ? 'border-danger focus-visible:ring-danger'
                : 'border-input hover:border-neutral-400',
              // Padding for left/right elements
              leftElement && 'pl-10',
              rightElement && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Right element */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightElement}
            </div>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p id={errorId} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
