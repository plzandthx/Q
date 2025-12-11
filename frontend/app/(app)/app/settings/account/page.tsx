'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Key, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function AccountSettingsPage() {
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: 'john@company.com',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onEmailSubmit = async (data: EmailForm) => {
    setIsEmailSubmitting(true);
    // TODO: Implement email update API call
    console.log('Update email:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsEmailSubmitting(false);
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    // TODO: Implement password change API call
    console.log('Change password:', data);
    passwordForm.reset();
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API call
    console.log('Delete account');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Account"
        description="Manage your account settings and security."
        breadcrumbs={[
          { label: 'Settings', href: '/app/settings' },
          { label: 'Account' },
        ]}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="max-w-2xl space-y-6"
      >
        {/* Email */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Your email is used for login and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    className="mt-1 max-w-md"
                    {...emailForm.register('email')}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={isEmailSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isEmailSubmitting ? 'Saving...' : 'Update Email'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Use a strong password that you don&apos;t use elsewhere.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    className="mt-1 max-w-md"
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    New Password
                  </label>
                  <Input
                    type="password"
                    className="mt-1 max-w-md"
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    className="mt-1 max-w-md"
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {passwordForm.formState.isSubmitting
                    ? 'Changing...'
                    : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sessions */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices that are signed in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-neutral-500">
                      Chrome on macOS • San Francisco, CA
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Last active: Just now
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    This device
                  </span>
                </div>
                <Button variant="outline">Sign out all other sessions</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Account */}
        <motion.div variants={staggerItemVariants}>
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
