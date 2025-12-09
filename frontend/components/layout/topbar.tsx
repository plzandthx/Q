'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  Search,
  Plus,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Topbar Component
 *
 * The top navigation bar containing organization selector, user menu,
 * and quick actions.
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface TopbarProps {
  user?: UserInfo;
  organizations?: Organization[];
  currentOrganization?: Organization;
  onOrganizationChange?: (org: Organization) => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  className?: string;
}

const Topbar: React.FC<TopbarProps> = ({
  user,
  organizations = [],
  currentOrganization,
  onOrganizationChange,
  onMenuClick,
  showMenuButton = false,
  className,
}) => {
  return (
    <header
      className={cn(
        'h-topbar flex items-center justify-between px-4 lg:px-6',
        'bg-card border-b border-border',
        className
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Organization selector */}
        {organizations.length > 1 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {currentOrganization?.name || 'Select organization'}
                </span>
                {currentOrganization?.plan && (
                  <Badge variant="secondary" size="sm">
                    {currentOrganization.plan}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Organizations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => onOrganizationChange?.(org)}
                  className={cn(
                    org.id === currentOrganization?.id && 'bg-accent'
                  )}
                >
                  <Building className="h-4 w-4 mr-2" />
                  <span className="flex-1">{org.name}</span>
                  {org.plan && (
                    <Badge variant="secondary" size="sm">
                      {org.plan}
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : currentOrganization ? (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{currentOrganization.name}</span>
            {currentOrganization.plan && (
              <Badge variant="secondary" size="sm">
                {currentOrganization.plan}
              </Badge>
            )}
          </div>
        ) : null}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search (placeholder) */}
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Quick create */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/app/projects/new">New Project</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/widgets/new">New Widget</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/integrations">Connect Integration</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {/* Notification badge */}
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-1">
              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-primary">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/settings/account">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export { Topbar };
