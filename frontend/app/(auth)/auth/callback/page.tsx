'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
        <p className="text-sm text-neutral-600">Completing sign in...</p>
      </div>
    </div>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();

      // Get the code from URL parameters (for PKCE flow)
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      if (code) {
        try {
          // Exchange the code for a session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            setError(exchangeError.message);
            return;
          }

          // Successfully authenticated - redirect to app
          router.replace('/app');
        } catch (err) {
          console.error('Callback error:', err);
          setError('An unexpected error occurred during authentication');
        }
      } else {
        // No code parameter - check if we already have a session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          router.replace('/app');
        } else {
          // No session and no code - redirect to sign in
          router.replace('/auth/sign-in');
        }
      }
    };

    void handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-red-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
            <span className="text-red-600 text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Authentication Error</h2>
          <p className="text-sm text-neutral-600 max-w-sm">{error}</p>
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="mt-4 text-sm text-primary-600 hover:text-primary-500 font-medium"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return <LoadingSpinner />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
