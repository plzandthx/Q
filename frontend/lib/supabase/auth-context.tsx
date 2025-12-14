'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from './client';
import type { User, Session } from '@supabase/supabase-js';
import type { Tables } from './database.types';

type UserProfile = Tables<'users'>;
type Organization = Tables<'organizations'>;
type OrgMembership = Tables<'org_memberships'>;

// Timeout for auth operations to prevent hanging forever
const AUTH_TIMEOUT = 10000; // 10 seconds

function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithGithub: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setCurrentOrganization: (org: Organization) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string, authUser?: User) => {
    let { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // If no profile exists (OAuth user first login), create one
    if (!profileData && authUser) {
      const name = authUser.user_metadata?.name ||
                   authUser.user_metadata?.full_name ||
                   authUser.email?.split('@')[0] ||
                   'User';

      const { data: newProfile } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          name,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          auth_provider: authUser.app_metadata?.provider === 'google' ? 'GOOGLE' : 'PASSWORD',
          email_verified: authUser.email_confirmed_at ? true : false,
        } as Record<string, unknown>)
        .select()
        .single();

      if (newProfile) {
        profileData = newProfile;

        // Create default organization for new OAuth users
        const orgSlug = authUser.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') || 'user';
        const { data: orgData } = await supabase
          .from('organizations')
          .insert({
            name: `${name}'s Organization`,
            slug: `${orgSlug}-${Date.now()}`,
          } as Record<string, unknown>)
          .select()
          .single();

        if (orgData) {
          await supabase.from('org_memberships').insert({
            organization_id: (orgData as { id: string }).id,
            user_id: authUser.id,
            role: 'OWNER',
          } as Record<string, unknown>);
        }
      }
    }

    if (profileData) {
      setProfile(profileData as UserProfile);
    }

    // Fetch organizations the user belongs to
    const { data: memberships } = await supabase
      .from('org_memberships')
      .select(`
        *,
        organizations (*)
      `)
      .eq('user_id', userId);

    if (memberships && memberships.length > 0) {
      const orgs = memberships
        .map((m: OrgMembership & { organizations: Organization }) => m.organizations)
        .filter(Boolean);
      setOrganizations(orgs);

      // Set first org as current if none selected
      if (!currentOrganization && orgs.length > 0) {
        setCurrentOrganization(orgs[0]);
      }
    }
  }, [supabase, currentOrganization]);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    const initAuth = async () => {
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        console.warn('Supabase is not configured. Authentication will not work.');
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session: currentSession } } = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT,
          'getSession'
        );
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Wrap fetchProfile in try-catch to prevent it from blocking loading state
          try {
            await withTimeout(
              fetchProfile(currentSession.user.id, currentSession.user),
              AUTH_TIMEOUT,
              'fetchProfile'
            );
          } catch (profileError) {
            console.error('Error fetching profile (non-blocking):', profileError);
            // Continue without profile - user is still authenticated
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          try {
            await withTimeout(
              fetchProfile(newSession.user.id, newSession.user),
              AUTH_TIMEOUT,
              'fetchProfile on sign-in'
            );
          } catch (profileError) {
            console.error('Error fetching profile on sign-in:', profileError);
            // Continue without profile - user is still authenticated
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setOrganizations([]);
          setCurrentOrganization(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.') };
    }

    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        AUTH_TIMEOUT,
        'signIn'
      );

      if (!error) {
        router.push('/app');
      }

      return { error: error as Error | null };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.') };
    }

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
            emailRedirectTo: `${window.location.origin}/Q/auth/callback`,
          },
        }),
        AUTH_TIMEOUT,
        'signUp'
      );

      if (!error && data.user) {
        // Create user profile in our users table
        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          name,
          auth_provider: 'PASSWORD',
          email_verified: false,
        } as Record<string, unknown>);

        // Create a default organization for the user
        const orgSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');
        const { data: orgData } = await supabase
          .from('organizations')
          .insert({
            name: `${name}'s Organization`,
            slug: `${orgSlug}-${Date.now()}`,
          } as Record<string, unknown>)
          .select()
          .single();

        if (orgData) {
          // Add user as owner of the organization
          await supabase.from('org_memberships').insert({
            organization_id: (orgData as { id: string }).id,
            user_id: data.user.id,
            role: 'OWNER',
          } as Record<string, unknown>);
        }
      }

      return { error: error as Error | null };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: err as Error };
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.') };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/Q/auth/callback`,
      },
    });

    if (error) {
      // Provide more helpful error messages for common OAuth issues
      if (error.message?.includes('provider')) {
        return { error: new Error('Google OAuth is not enabled in Supabase. Please enable it in your Supabase Dashboard under Authentication > Providers.') };
      }
    }

    return { error: error as Error | null };
  };

  const signInWithGithub = async () => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.') };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/Q/auth/callback`,
      },
    });

    if (error) {
      // Provide more helpful error messages for common OAuth issues
      if (error.message?.includes('provider')) {
        return { error: new Error('GitHub OAuth is not enabled in Supabase. Please enable it in your Supabase Dashboard under Authentication > Providers.') };
      }
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        organizations,
        currentOrganization,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithGithub,
        signOut,
        setCurrentOrganization,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
