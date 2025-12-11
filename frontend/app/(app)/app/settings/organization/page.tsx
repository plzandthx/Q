'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Upload, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const orgSchema = z.object({
  name: z.string().min(2, 'Organization name is required'),
  slug: z.string().min(2, 'URL slug is required').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
});

type OrgForm = z.infer<typeof orgSchema>;

export default function OrganizationSettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrgForm>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: 'Acme Inc',
      slug: 'acme',
      website: 'https://acme.com',
      description: 'Building the future of customer feedback',
    },
  });

  const onSubmit = async (data: OrgForm) => {
    // TODO: Implement save API call
    console.log('Save organization:', data);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Organization"
        description="Manage your organization settings and branding."
        breadcrumbs={[
          { label: 'Settings', href: '/app/settings' },
          { label: 'Organization' },
        ]}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="max-w-2xl space-y-6"
      >
        {/* Logo */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Organization Logo</CardTitle>
              <CardDescription>
                This will be displayed in your widgets and reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl bg-primary-100 text-primary-700">
                    <Building2 className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-neutral-500">
                    PNG, JPG, or SVG. Max size 2MB. Recommended 256x256px.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Organization Form */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Organization Name
                  </label>
                  <Input className="mt-1" {...register('name')} />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    URL Slug
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-neutral-500">qcsat.io/</span>
                    <Input className="max-w-xs" {...register('slug')} />
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Website
                  </label>
                  <Input
                    type="url"
                    className="mt-1"
                    placeholder="https://yourcompany.com"
                    {...register('website')}
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.website.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Description
                  </label>
                  <Textarea
                    className="mt-1"
                    rows={3}
                    placeholder="A brief description of your organization"
                    {...register('description')}
                  />
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
      </motion.div>
    </PageContainer>
  );
}
