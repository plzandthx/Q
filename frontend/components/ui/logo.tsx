'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type LogoVariant = 'primary' | 'white' | 'black' | 'currentColor';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Height-based sizing to maintain natural aspect ratio (167:149 ≈ 1.12:1)
const sizeMap: Record<LogoSize, { height: number; fontSize: string }> = {
  xs: { height: 18, fontSize: 'text-sm' },
  sm: { height: 22, fontSize: 'text-base' },
  md: { height: 28, fontSize: 'text-lg' },
  lg: { height: 36, fontSize: 'text-xl' },
  xl: { height: 48, fontSize: 'text-2xl' },
};

const colorMap: Record<Exclude<LogoVariant, 'currentColor'>, string> = {
  primary: '#389084',
  white: '#ffffff',
  black: '#000000',
};

export interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showWordmark?: boolean;
  className?: string;
}

/**
 * Q CSAT Logo Component
 *
 * Renders the Q CSAT logo as an inline SVG for flexibility with theming.
 * Supports multiple color variants and sizes.
 *
 * @example
 * // Primary logo with wordmark
 * <Logo variant="primary" size="md" showWordmark />
 *
 * // White logo for dark backgrounds
 * <Logo variant="white" size="lg" />
 *
 * // Inherit color from parent
 * <Logo variant="currentColor" size="sm" />
 */
export function Logo({
  variant = 'primary',
  size = 'md',
  showWordmark = false,
  className,
}: LogoProps) {
  const { height, fontSize } = sizeMap[size];
  const strokeColor = variant === 'currentColor' ? 'currentColor' : colorMap[variant];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        height={height}
        viewBox="0 0 167 149"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Q CSAT Logo"
        role="img"
        className="flex-shrink-0"
        style={{ overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <mask
          id={`logo-mask-${variant}-${size}`}
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="151"
          height="147"
        >
          <path
            d="M73.085 0.580078H77.7256C117.769 0.580078 150.23 33.0416 150.23 73.085C150.23 113.128 117.769 145.591 77.7256 145.591H73.085C33.0416 145.591 0.580078 113.128 0.580078 73.085C0.580247 33.0417 33.0417 0.580255 73.085 0.580078Z"
            fill="#F5F5F5"
            stroke={strokeColor}
            strokeWidth="1.16008"
          />
        </mask>
        <g mask={`url(#logo-mask-${variant}-${size})`}>
          <circle cx="75.4057" cy="-19.7213" r="58.0042" stroke={strokeColor} strokeWidth="11.6008" />
          <circle cx="-17.4018" cy="73.0853" r="58.0042" transform="rotate(90 -17.4018 73.0853)" stroke={strokeColor} strokeWidth="11.6008" />
          <circle cx="75.4063" cy="165.892" r="58.0042" transform="rotate(90 75.4063 165.892)" stroke={strokeColor} strokeWidth="11.6008" />
          <circle cx="168.212" cy="73.0853" r="58.0042" transform="rotate(90 168.212 73.0853)" stroke={strokeColor} strokeWidth="11.6008" />
          <circle cx="-17.4011" cy="73.0854" r="37.1227" stroke={strokeColor} strokeWidth="11.6008" />
          <circle cx="168.213" cy="73.0853" r="37.1227" stroke={strokeColor} strokeWidth="11.6008" />
          <circle cx="75.406" cy="-19.7214" r="37.1227" transform="rotate(90 75.406 -19.7214)" stroke={strokeColor} strokeWidth="11.6008" />
          <circle cx="75.406" cy="165.892" r="37.1227" transform="rotate(90 75.406 165.892)" stroke={strokeColor} strokeWidth="11.6008" />
        </g>
        <path
          d="M125.106 134.798C135.678 146.252 148.012 143.619 158.586 133.917"
          stroke={strokeColor}
          strokeWidth="11.6008"
          strokeLinecap="square"
        />
        <path
          d="M130.394 117.178C137.442 123.345 140.966 122.464 147.133 124.226"
          stroke={strokeColor}
          strokeWidth="11.5944"
        />
      </svg>
      {showWordmark && (
        <span className={cn('font-semibold', fontSize)}>CSAT</span>
      )}
    </div>
  );
}

/**
 * Logo Image Component
 *
 * Renders the logo using Next.js Image component for optimal loading.
 * Use this when you don't need dynamic color changes.
 */
export interface LogoImageProps {
  variant?: Exclude<LogoVariant, 'currentColor'>;
  size?: LogoSize;
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
}

export function LogoImage({
  variant = 'primary',
  size = 'md',
  showWordmark = false,
  className,
  priority = false,
}: LogoImageProps) {
  const { height, fontSize } = sizeMap[size];
  const src = `/assets/logos/q-csat-logo-${variant}.svg`;
  // Calculate width based on aspect ratio (167:149)
  const width = Math.round(height * (167 / 149));

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Image
        src={src}
        alt="Q CSAT Logo"
        width={width}
        height={height}
        priority={priority}
        style={{ width: 'auto', height }}
      />
      {showWordmark && (
        <span className={cn('font-semibold', fontSize)}>CSAT</span>
      )}
    </div>
  );
}

export default Logo;
