'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    // TODO: Implement forgot password API call
    setSubmittedEmail(data.email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="text-center"
      >
        <motion.div variants={staggerItemVariants}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">Check your email</h1>
          <p className="mt-2 text-sm text-neutral-600">
            We sent a password reset link to
          </p>
          <p className="font-medium text-neutral-900">{submittedEmail}</p>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-600">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  try another email address
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
    >
      <motion.div variants={staggerItemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900">Reset your password</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </motion.div>

      <motion.form
        variants={staggerItemVariants}
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Email address
          </label>
          <Input
            type="email"
            className="mt-1"
            placeholder="you@company.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </motion.form>

      <motion.div variants={staggerItemVariants} className="mt-8 text-center">
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </motion.div>
    </motion.div>
  );
}
