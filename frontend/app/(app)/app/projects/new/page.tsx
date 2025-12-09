'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const projectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  type: z.enum(['web', 'mobile', 'support', 'other']),
});

type ProjectForm = z.infer<typeof projectSchema>;

const projectTypes = [
  {
    value: 'web',
    label: 'Web Application',
    description: 'Website or web-based SaaS product',
  },
  {
    value: 'mobile',
    label: 'Mobile App',
    description: 'iOS, Android, or cross-platform app',
  },
  {
    value: 'support',
    label: 'Customer Support',
    description: 'Support tickets and interactions',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Custom use case or mixed channels',
  },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      type: 'web',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: ProjectForm) => {
    // TODO: Implement project creation API call
    console.log('Create project:', data);
    // Redirect to project overview
    router.push('/app/projects/1/overview');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Project"
        description="Set up a new project to start collecting customer feedback."
        breadcrumbs={[
          { label: 'Projects', href: '/app/projects' },
          { label: 'New Project' },
        ]}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="max-w-2xl mx-auto"
      >
        {/* Progress Indicator */}
        <motion.div variants={staggerItemVariants} className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= 1
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-16 rounded ${
                step >= 2 ? 'bg-primary-500' : 'bg-neutral-200'
              }`}
            />
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= 2
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              2
            </div>
          </div>
          <div className="mt-2 flex justify-center gap-20 text-sm text-neutral-500">
            <span>Basic Info</span>
            <span>Project Type</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Project Name
                    </label>
                    <Input
                      className="mt-1"
                      placeholder="e.g., Mobile App, Web Dashboard"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Description{' '}
                      <span className="text-neutral-400">(optional)</span>
                    </label>
                    <Textarea
                      className="mt-1"
                      placeholder="Brief description of what this project tracks..."
                      rows={3}
                      {...register('description')}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setStep(2)}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Project Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={selectedType}
                    onValueChange={(value) =>
                      setValue('type', value as ProjectForm['type'])
                    }
                    className="space-y-3"
                  >
                    {projectTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedType === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <RadioGroupItem value={type.value} className="mt-0.5" />
                        <div>
                          <p className="font-medium text-neutral-900">
                            {type.label}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {type.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Project'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </form>

        <motion.div variants={staggerItemVariants} className="mt-6 text-center">
          <Link
            href="/app/projects"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Cancel and go back
          </Link>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
