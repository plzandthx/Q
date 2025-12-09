import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Textarea Component
 *
 * A styled multiline text input with label and error support.
 */

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, description, error, disabled, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const descriptionId = `${textareaId}-description`;
    const errorId = `${textareaId}-error`;
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}

        {description && !hasError && (
          <p id={descriptionId} className="text-sm text-muted-foreground mb-1.5">
            {description}
          </p>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          aria-describedby={hasError ? errorId : description ? descriptionId : undefined}
          aria-invalid={hasError}
          className={cn(
            'flex min-h-[100px] w-full rounded-lg border bg-background px-3 py-2',
            'text-sm placeholder:text-muted-foreground',
            'transition-colors duration-200 resize-y',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
            hasError
              ? 'border-danger focus-visible:ring-danger'
              : 'border-input hover:border-neutral-400',
            className
          )}
          {...props}
        />

        {hasError && (
          <p id={errorId} className="mt-1.5 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
