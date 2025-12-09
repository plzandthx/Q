'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * RadioGroup Component
 *
 * A group of radio buttons. Includes a specialized CsatScoreRadioGroup
 * for CSAT score selection (1-5).
 */

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-5 w-5 rounded-full border border-input',
        'text-primary ring-offset-background',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-primary',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Labeled radio item
interface RadioGroupLabeledItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: string;
  description?: string;
}

const RadioGroupLabeledItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupLabeledItemProps
>(({ className, label, description, id, ...props }, ref) => {
  const itemId = id || React.useId();

  return (
    <div className="flex items-start gap-3">
      <RadioGroupItem ref={ref} id={itemId} {...props} />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={itemId}
          className="text-sm font-medium leading-none cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
});
RadioGroupLabeledItem.displayName = 'RadioGroupLabeledItem';

// CSAT Score Radio Group (1-5)
interface CsatScoreRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  labels?: { [key: number]: string };
}

const defaultCsatLabels: { [key: number]: string } = {
  1: 'Very Dissatisfied',
  2: 'Dissatisfied',
  3: 'Neutral',
  4: 'Satisfied',
  5: 'Very Satisfied',
};

const csatColors: { [key: number]: string } = {
  1: 'border-csat-1 data-[state=checked]:bg-csat-1 data-[state=checked]:border-csat-1',
  2: 'border-csat-2 data-[state=checked]:bg-csat-2 data-[state=checked]:border-csat-2',
  3: 'border-csat-3 data-[state=checked]:bg-csat-3 data-[state=checked]:border-csat-3',
  4: 'border-csat-4 data-[state=checked]:bg-csat-4 data-[state=checked]:border-csat-4',
  5: 'border-csat-5 data-[state=checked]:bg-csat-5 data-[state=checked]:border-csat-5',
};

const CsatScoreRadioGroup: React.FC<CsatScoreRadioGroupProps> = ({
  value,
  onValueChange,
  disabled,
  name,
  labels = defaultCsatLabels,
}) => {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      className="flex gap-2"
    >
      {[1, 2, 3, 4, 5].map((score) => (
        <div key={score} className="flex flex-col items-center gap-1.5">
          <RadioGroupPrimitive.Item
            value={String(score)}
            className={cn(
              'h-10 w-10 rounded-full border-2 transition-all duration-200',
              'flex items-center justify-center',
              'text-sm font-semibold',
              'hover:scale-110',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'data-[state=checked]:text-white data-[state=unchecked]:text-neutral-600',
              csatColors[score]
            )}
          >
            {score}
          </RadioGroupPrimitive.Item>
          <span className="text-xs text-muted-foreground text-center max-w-[60px] leading-tight">
            {labels[score]}
          </span>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
};

// Compact CSAT Score (without labels)
const CsatScoreCompact: React.FC<CsatScoreRadioGroupProps> = ({
  value,
  onValueChange,
  disabled,
  name,
}) => {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      className="flex gap-1"
    >
      {[1, 2, 3, 4, 5].map((score) => (
        <RadioGroupPrimitive.Item
          key={score}
          value={String(score)}
          className={cn(
            'h-8 w-8 rounded-full border-2 transition-all duration-200',
            'flex items-center justify-center',
            'text-xs font-semibold',
            'hover:scale-110',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:text-white data-[state=unchecked]:text-neutral-600',
            csatColors[score]
          )}
        >
          {score}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
};

export {
  RadioGroup,
  RadioGroupItem,
  RadioGroupLabeledItem,
  CsatScoreRadioGroup,
  CsatScoreCompact,
};
