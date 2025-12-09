'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="text-center max-w-md"
      >
        <motion.div variants={staggerItemVariants}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">
            Something went wrong
          </h1>
          <p className="mt-2 text-neutral-600">
            We apologize for the inconvenience. An unexpected error occurred.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-neutral-400">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={staggerItemVariants}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8">
          <p className="text-sm text-neutral-500">
            If the problem persists,{' '}
            <Link href="/contact" className="text-primary-600 hover:underline">
              contact support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
