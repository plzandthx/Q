'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (_data: ResetPasswordForm) => {
    // TODO: Implement reset password API call
    setSuccess(true);
  };

  if (success) {
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
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">
            Password reset successful
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8">
          <Button asChild className="w-full">
            <Link href="/auth/sign-in">Sign in</Link>
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
    >
      <motion.div variants={staggerItemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900">Set new password</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Your new password must be at least 8 characters long.
        </p>
      </motion.div>

      <motion.form
        variants={staggerItemVariants}
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-neutral-700">
            New password
          </label>
          <div className="relative mt-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">
            Confirm new password
          </label>
          <Input
            type="password"
            className="mt-1"
            placeholder="••••••••"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </Button>
      </motion.form>
    </motion.div>
  );
}
