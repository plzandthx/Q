'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Star,
  ThumbsUp,
  Smile,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const widgetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  projectId: z.string().min(1, 'Please select a project'),
  type: z.enum(['popup', 'inline', 'slide-in']),
  question: z.string().min(5, 'Question must be at least 5 characters'),
  ratingType: z.enum(['stars', 'numeric', 'emoji', 'thumbs']),
});

type WidgetForm = z.infer<typeof widgetSchema>;

const widgetTypes = [
  {
    value: 'popup',
    label: 'Popup Modal',
    description: 'Appears as a centered modal overlay',
  },
  {
    value: 'inline',
    label: 'Inline Embed',
    description: 'Embedded directly in your page',
  },
  {
    value: 'slide-in',
    label: 'Slide-in Panel',
    description: 'Slides in from the corner of the screen',
  },
];

const ratingTypes = [
  { value: 'stars', label: '5-Star Rating', icon: Star },
  { value: 'numeric', label: 'Numeric Scale (1-10)', icon: MessageSquare },
  { value: 'emoji', label: 'Emoji Scale', icon: Smile },
  { value: 'thumbs', label: 'Thumbs Up/Down', icon: ThumbsUp },
];

// Mock projects - replace with API data
const projects = [
  { id: '1', name: 'Mobile App' },
  { id: '2', name: 'Web Dashboard' },
  { id: '3', name: 'Customer Support' },
];

export default function NewWidgetPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WidgetForm>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      type: 'popup',
      ratingType: 'stars',
      question: 'How satisfied are you with your experience?',
    },
  });

  const selectedType = watch('type');
  const selectedRatingType = watch('ratingType');

  const onSubmit = async (data: WidgetForm) => {
    // TODO: Implement widget creation API call
    console.log('Create widget:', data);
    router.push('/app/widgets');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Widget"
        description="Set up a new feedback widget for your project."
        breadcrumbs={[
          { label: 'Widgets', href: '/app/widgets' },
          { label: 'New Widget' },
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
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step >= s
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {s}
                </div>
                {i < 2 && (
                  <div
                    className={`h-1 w-16 rounded ml-4 ${
                      step > s ? 'bg-primary-500' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-center gap-12 text-sm text-neutral-500">
            <span>Basics</span>
            <span>Widget Type</span>
            <span>Question</span>
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
                      Widget Name
                    </label>
                    <Input
                      className="mt-1"
                      placeholder="e.g., Main Feedback Widget"
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
                      Project
                    </label>
                    <Select
                      onValueChange={(value) => setValue('projectId', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.projectId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.projectId.message}
                      </p>
                    )}
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
                  <CardTitle>Widget Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={selectedType}
                    onValueChange={(value) =>
                      setValue('type', value as WidgetForm['type'])
                    }
                    className="space-y-3"
                  >
                    {widgetTypes.map((type) => (
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
                    <Button type="button" onClick={() => setStep(3)}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Survey Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Question Text
                    </label>
                    <Textarea
                      className="mt-1"
                      placeholder="e.g., How satisfied are you with your experience?"
                      rows={3}
                      {...register('question')}
                    />
                    {errors.question && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.question.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Rating Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {ratingTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setValue(
                                'ratingType',
                                type.value as WidgetForm['ratingType']
                              )
                            }
                            className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                              selectedRatingType === type.value
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <Icon className="h-5 w-5 text-neutral-600" />
                            <span className="text-sm font-medium">
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Widget'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </form>

        <motion.div variants={staggerItemVariants} className="mt-6 text-center">
          <Link
            href="/app/widgets"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Cancel and go back
          </Link>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
