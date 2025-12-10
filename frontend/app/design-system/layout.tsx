import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design System | Q',
  description: 'Comprehensive design system documentation for the Q CSAT application. Explore colors, typography, components, and more.',
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
