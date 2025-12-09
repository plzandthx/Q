'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

type VerificationState = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const [state, setState] = useState<VerificationState>('loading');

  useEffect(() => {
    // TODO: Implement email verification API call
    const verifyEmail = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setState('success');
      } catch (error) {
        setState('error');
      }
    };

    verifyEmail();
  }, []);

  if (state === 'loading') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="text-center"
      >
        <motion.div variants={staggerItemVariants}>
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-500" />
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">
            Verifying your email
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Please wait while we verify your email address...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  if (state === 'error') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="text-center"
      >
        <motion.div variants={staggerItemVariants}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            This verification link is invalid or has expired. Please request a new
            one.
          </p>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8 space-y-3">
          <Button asChild className="w-full">
            <Link href="/auth/sign-in">Sign in to resend</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/contact">Contact support</Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="text-center"
    >
      <motion.div variants={staggerItemVariants}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Email verified</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Your email has been successfully verified. You can now access all
          features of your account.
        </p>
      </motion.div>

      <motion.div variants={staggerItemVariants} className="mt-8">
        <Button asChild className="w-full">
          <Link href="/app">Go to Dashboard</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
