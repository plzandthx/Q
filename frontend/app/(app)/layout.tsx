'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingState() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="space-y-4 text-center">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, organizations, currentOrganization, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/sign-in');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <LoadingState />;
  }

  // Build user object for AppShell
  const appUser = {
    id: user.id,
    name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
  };

  // Transform organizations for AppShell
  const appOrganizations = organizations.map(org => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    logoUrl: org.logo_url,
  }));

  const appCurrentOrganization = currentOrganization ? {
    id: currentOrganization.id,
    name: currentOrganization.name,
    slug: currentOrganization.slug,
    logoUrl: currentOrganization.logo_url,
  } : appOrganizations[0] || { id: '', name: 'My Organization', slug: 'default', logoUrl: undefined };

  return (
    <AppShell
      user={appUser}
      organizations={appOrganizations}
      currentOrganization={appCurrentOrganization}
      onSignOut={signOut}
    >
      {children}
    </AppShell>
  );
}
