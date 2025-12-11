'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="text-center max-w-md"
      >
        <motion.div variants={staggerItemVariants}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
            <ShieldX className="h-10 w-10 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">
            Access Denied
          </h1>
          <p className="mt-2 text-neutral-600">
            You don&apos;t have permission to access this page. Please contact your
            administrator if you believe this is a mistake.
          </p>
        </motion.div>

        <motion.div
          variants={staggerItemVariants}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8">
          <p className="text-sm text-neutral-500">
            Wrong account?{' '}
            <Link
              href="/auth/sign-in"
              className="text-primary-600 hover:underline"
            >
              Sign in with a different account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
