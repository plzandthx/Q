'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  timezone: z.string(),
  active: z.boolean(),
});

type ProjectForm = z.infer<typeof projectSchema>;

export function SettingsClient() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: 'Mobile App',
      description: 'iOS and Android app feedback',
      timezone: 'America/New_York',
      active: true,
    },
  });

  const onSubmit = async (data: ProjectForm) => {
    // TODO: Implement save API call
    void data;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="space-y-6 max-w-2xl"
    >
      {/* General Settings */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic project configuration and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Project Name
                </label>
                <Input className="mt-1" {...register('name')} />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Description
                </label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  {...register('description')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Timezone
                </label>
                <Input className="mt-1" {...register('timezone')} />
                <p className="mt-1 text-xs text-neutral-500">
                  Used for scheduling and reporting
                </p>
              </div>

              <div className="flex items-center justify-between py-4 border-t">
                <div>
                  <p className="font-medium text-neutral-900">Project Status</p>
                  <p className="text-sm text-neutral-500">
                    Enable or disable data collection
                  </p>
                </div>
                <Switch {...register('active')} defaultChecked />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Configuration */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              API keys and identifiers for this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Project ID
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  readOnly
                  value="proj_abc123xyz789"
                  className="font-mono text-sm bg-neutral-50"
                />
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Public Key
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  readOnly
                  value="pk_live_xxxxxxxxxxxxx"
                  className="font-mono text-sm bg-neutral-50"
                />
                <Button variant="outline" size="sm">
                  Copy
                </Button>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Safe to use in client-side code
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={staggerItemVariants}>
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="danger">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                These actions cannot be undone. Please proceed with caution.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between py-4 border-t">
              <div>
                <p className="font-medium text-neutral-900">Delete Project</p>
                <p className="text-sm text-neutral-500">
                  Permanently delete this project and all its data
                </p>
              </div>
              <Button variant="danger">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
