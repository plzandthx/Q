'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

export default function NotFound() {
  const router = useRouter();
  const [wasInApp, setWasInApp] = useState(false);

  useEffect(() => {
    // Check if the user was likely navigating within the app section
    // by checking the referrer or stored state
    if (typeof window !== 'undefined') {
      const referrer = document.referrer;
      const currentPath = window.location.pathname;

      // Check if coming from or going to /app section
      if (
        referrer.includes('/app') ||
        currentPath.startsWith('/app') ||
        currentPath.startsWith('/Q/app')
      ) {
        setWasInApp(true);
      }
    }
  }, []);

  const handleGoBack = () => {
    // Use router.back() for proper SPA navigation
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="text-center max-w-md"
      >
        <motion.div variants={staggerItemVariants}>
          <div className="text-[120px] font-bold text-neutral-200 leading-none">
            404
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">
            Page not found
          </h1>
          <p className="mt-2 text-neutral-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have
            been moved or deleted.
          </p>
        </motion.div>

        <motion.div
          variants={staggerItemVariants}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {wasInApp ? (
            <>
              <Button asChild>
                <Link href="/app">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </>
          )}
        </motion.div>

        {/* Always show option to go to app if user might be authenticated */}
        {!wasInApp && (
          <motion.div variants={staggerItemVariants} className="mt-4">
            <Button variant="ghost" asChild>
              <Link href="/app">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Go to App Dashboard
              </Link>
            </Button>
          </motion.div>
        )}

        <motion.div variants={staggerItemVariants} className="mt-8">
          <p className="text-sm text-neutral-500">
            Need help?{' '}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
