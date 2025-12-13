/**
 * Q CSAT Design System - Utility Functions
 * 
 * Helper functions for common patterns in the design system.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// CLASS NAME UTILITIES
// ============================================================================

/**
 * Merge Tailwind classes intelligently
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================================
// NUMBER FORMATTING UTILITIES
// ============================================================================

/**
 * Format number as percentage
 * @param value - The decimal value to format (e.g., 0.125 = 12.5%)
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format CSAT score for display
 * @param score - The CSAT score (1-5 or decimal)
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatScore(score: number, decimals: number = 1): string {
  return score.toFixed(decimals);
}

/**
 * Format numbers with K/M suffix
 * @param value - The number to format
 */
export function formatCompact(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format currency
 * @param value - The number to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

// ============================================================================
// CSAT UTILITIES
// ============================================================================

const csatTextColors: Record<number, string> = {
  1: 'text-red-500',
  2: 'text-orange-500',
  3: 'text-yellow-500',
  4: 'text-lime-500',
  5: 'text-green-500',
};

const csatBgColors: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-lime-500',
  5: 'bg-green-500',
};

const csatLightBgColors: Record<number, string> = {
  1: 'bg-red-100',
  2: 'bg-orange-100',
  3: 'bg-yellow-100',
  4: 'bg-lime-100',
  5: 'bg-green-100',
};

const csatHexColors: Record<number, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#84cc16',
  5: '#22c55e',
};

const csatLabels: Record<number, string> = {
  1: 'Very Dissatisfied',
  2: 'Dissatisfied',
  3: 'Neutral',
  4: 'Satisfied',
  5: 'Very Satisfied',
};

/**
 * Get text color class for CSAT score
 */
export function getCsatScoreColor(score: number): string {
  const roundedScore = Math.round(Math.max(1, Math.min(5, score)));
  return csatTextColors[roundedScore] || 'text-neutral-500';
}

/**
 * Get background color class for CSAT score
 */
export function getCsatScoreBgColor(score: number): string {
  const roundedScore = Math.round(Math.max(1, Math.min(5, score)));
  return csatBgColors[roundedScore] || 'bg-neutral-500';
}

/**
 * Get light background color class for CSAT score
 */
export function getCsatScoreLightBgColor(score: number): string {
  const roundedScore = Math.round(Math.max(1, Math.min(5, score)));
  return csatLightBgColors[roundedScore] || 'bg-neutral-100';
}

/**
 * Get hex color for CSAT score
 */
export function getCsatScoreHexColor(score: number): string {
  const roundedScore = Math.round(Math.max(1, Math.min(5, score)));
  return csatHexColors[roundedScore] || '#71717a';
}

/**
 * Get label for CSAT score
 */
export function getCsatScoreLabel(score: number): string {
  const roundedScore = Math.round(Math.max(1, Math.min(5, score)));
  return csatLabels[roundedScore] || 'Unknown';
}

// ============================================================================
// DATE FORMATTING UTILITIES
// ============================================================================

type DateFormat = 'short' | 'long' | 'relative' | 'time' | 'datetime';

/**
 * Format dates
 * @param date - Date to format
 * @param format - Format type: 'short', 'long', 'relative', 'time', 'datetime'
 */
export function formatDate(
  date: Date | string | number,
  format: DateFormat = 'short'
): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    
    case 'relative':
      return formatRelativeDate(d);
    
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    
    case 'datetime':
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    
    default:
      return d.toLocaleDateString();
  }
}

/**
 * Format relative date (e.g., "2 hours ago", "in 3 days")
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);
  
  if (Math.abs(diffSeconds) < 60) {
    return 'just now';
  }
  
  if (Math.abs(diffMinutes) < 60) {
    const minutes = Math.abs(diffMinutes);
    return diffMinutes < 0
      ? `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
      : `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  if (Math.abs(diffHours) < 24) {
    const hours = Math.abs(diffHours);
    return diffHours < 0
      ? `${hours} hour${hours !== 1 ? 's' : ''} ago`
      : `in ${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  if (Math.abs(diffDays) < 30) {
    const days = Math.abs(diffDays);
    return diffDays < 0
      ? `${days} day${days !== 1 ? 's' : ''} ago`
      : `in ${days} day${days !== 1 ? 's' : ''}`;
  }
  
  return formatDate(date, 'short');
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncating
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Generate initials from name
 * @param name - Full name
 * @param maxLength - Maximum number of initials (default: 2)
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .filter(part => part.length > 0)
    .map(part => part[0].toUpperCase())
    .slice(0, maxLength)
    .join('');
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

/**
 * Debounce function calls
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function calls
 * @param fn - Function to throttle
 * @param limit - Time limit in milliseconds
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Group array by key
 */
export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Map<T[K], T[]> {
  return array.reduce((acc, item) => {
    const groupKey = item[key];
    const group = acc.get(groupKey) || [];
    group.push(item);
    acc.set(groupKey, group);
    return acc;
  }, new Map<T[K], T[]>());
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export const utils = {
  cn,
  formatPercent,
  formatScore,
  formatCompact,
  formatCurrency,
  formatDate,
  getCsatScoreColor,
  getCsatScoreBgColor,
  getCsatScoreLightBgColor,
  getCsatScoreHexColor,
  getCsatScoreLabel,
  truncate,
  getInitials,
  capitalize,
  toTitleCase,
  debounce,
  throttle,
  groupBy,
  sortBy,
} as const;

export default utils;
