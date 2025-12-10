'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarNav } from './sidebar-nav';
import { Topbar, type UserInfo, type Organization } from './topbar';
import { Button } from '@/components/ui/button';

/**
 * App Shell Component
 *
 * The main layout wrapper for the authenticated application.
 * Includes sidebar navigation, top bar, and main content area.
 *
 * Features:
 * - Collapsible sidebar on desktop
 * - Slide-out drawer on mobile
 * - Responsive layout
 */

export interface AppShellProps {
  children: React.ReactNode;
  user?: UserInfo;
  organizations?: Organization[];
  currentOrganization?: Organization;
  onOrganizationChange?: (org: Organization) => void;
  onSignOut?: () => void;
}

const AppShell: React.FC<AppShellProps> = ({
  children,
  user,
  organizations,
  currentOrganization,
  onOrganizationChange,
  onSignOut,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile menu on route change (for Next.js)
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-sidebar lg:hidden',
          'transform transition-transform duration-300 ease-in-out',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarNav />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
        <SidebarNav
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-sidebar-collapsed' : 'lg:pl-sidebar'
        )}
      >
        {/* Topbar */}
        <Topbar
          user={user}
          organizations={organizations}
          currentOrganization={currentOrganization}
          onOrganizationChange={onOrganizationChange}
          onSignOut={onSignOut}
          showMenuButton
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

// Simple layout without sidebar (for auth pages, etc.)
const SimpleLayout: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {children}
    </div>
  );
};

// Centered layout for auth pages
const CenteredLayout: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center bg-muted/30 p-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export { AppShell, SimpleLayout, CenteredLayout };
