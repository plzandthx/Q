'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  Copy,
  Eye,
  Code,
  Settings,
  Palette,
  BarChart3,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const widgetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  question: z.string().min(5, 'Question must be at least 5 characters'),
  isActive: z.boolean(),
  position: z.string(),
  primaryColor: z.string(),
  showBranding: z.boolean(),
});

type WidgetForm = z.infer<typeof widgetSchema>;

// Mock widget data - replace with API data
const mockWidget = {
  id: '1',
  name: 'Main Feedback Widget',
  project: 'Mobile App',
  type: 'popup',
  status: 'active',
  question: 'How satisfied are you with your experience?',
  ratingType: 'stars',
  responses: 12543,
  position: 'bottom-right',
  primaryColor: '#14b8a6',
  showBranding: true,
  embedCode: `<script src="https://cdn.qcsat.io/widget.js" data-widget-id="w_abc123"></script>`,
};

export default function WidgetDetailPage() {
  const params = useParams();
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<WidgetForm>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      name: mockWidget.name,
      question: mockWidget.question,
      isActive: mockWidget.status === 'active',
      position: mockWidget.position,
      primaryColor: mockWidget.primaryColor,
      showBranding: mockWidget.showBranding,
    },
  });

  const isActive = watch('isActive');

  const onSubmit = async (data: WidgetForm) => {
    // TODO: Implement save API call
    console.log('Save widget:', data);
  };

  const copyEmbedCode = () => {
    void navigator.clipboard.writeText(mockWidget.embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    // TODO: Implement delete API call
    console.log('Delete widget:', params.widgetId);
  };

  return (
    <PageContainer>
      <PageHeader
        title={mockWidget.name}
        description={`Configure your ${mockWidget.type} widget settings.`}
        breadcrumbs={[
          { label: 'Widgets', href: '/app/widgets' },
          { label: mockWidget.name },
        ]}
      >
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Paused'}
          </Badge>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </PageHeader>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
      >
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="embed">
              <Code className="mr-2 h-4 w-4" />
              Embed Code
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Settings Tab */}
            <TabsContent value="settings">
              <motion.div
                variants={staggerContainerVariants}
                className="space-y-6 max-w-2xl"
              >
                <motion.div variants={staggerItemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Widget Status</CardTitle>
                      <CardDescription>
                        Control whether this widget is collecting responses.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Active</p>
                          <p className="text-sm text-neutral-500">
                            Widget is {isActive ? 'visible' : 'hidden'} to users
                          </p>
                        </div>
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) =>
                            setValue('isActive', checked, { shouldDirty: true })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          Widget Name
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
                          Survey Question
                        </label>
                        <Textarea
                          className="mt-1"
                          rows={2}
                          {...register('question')}
                        />
                        {errors.question && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.question.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          Position
                        </label>
                        <Select
                          defaultValue={mockWidget.position}
                          onValueChange={(value) =>
                            setValue('position', value, { shouldDirty: true })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottom-right">
                              Bottom Right
                            </SelectItem>
                            <SelectItem value="bottom-left">
                              Bottom Left
                            </SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {isDirty && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <motion.div
                variants={staggerContainerVariants}
                className="space-y-6 max-w-2xl"
              >
                <motion.div variants={staggerItemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Colors</CardTitle>
                      <CardDescription>
                        Customize the widget&apos;s appearance to match your brand.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          Primary Color
                        </label>
                        <div className="mt-1 flex items-center gap-3">
                          <input
                            type="color"
                            {...register('primaryColor')}
                            className="h-10 w-20 cursor-pointer rounded border"
                          />
                          <Input
                            {...register('primaryColor')}
                            className="w-32"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Branding</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Q CSAT branding</p>
                          <p className="text-sm text-neutral-500">
                            Display &quot;Powered by Q CSAT&quot; in the widget
                          </p>
                        </div>
                        <Switch
                          checked={watch('showBranding')}
                          onCheckedChange={(checked) =>
                            setValue('showBranding', checked, { shouldDirty: true })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Embed Tab */}
            <TabsContent value="embed">
              <motion.div
                variants={staggerContainerVariants}
                className="space-y-6 max-w-2xl"
              >
                <motion.div variants={staggerItemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Embed Code</CardTitle>
                      <CardDescription>
                        Copy this code and paste it into your website before the
                        closing &lt;/body&gt; tag.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-lg text-sm overflow-x-auto">
                          {mockWidget.embedCode}
                        </pre>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={copyEmbedCode}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <motion.div
                variants={staggerContainerVariants}
                className="space-y-6"
              >
                <motion.div
                  variants={staggerContainerVariants}
                  className="grid gap-4 sm:grid-cols-3"
                >
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-neutral-500">Total Responses</p>
                      <p className="text-3xl font-bold text-neutral-900">
                        {mockWidget.responses.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-neutral-500">Avg. Score</p>
                      <p className="text-3xl font-bold text-neutral-900">4.3</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-neutral-500">Response Rate</p>
                      <p className="text-3xl font-bold text-neutral-900">23%</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                        <p className="text-neutral-500">Chart coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </form>

          {/* Danger Zone */}
          <motion.div variants={staggerItemVariants} className="mt-8">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Widget</p>
                    <p className="text-sm text-neutral-500">
                      Permanently delete this widget and all its data
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Widget
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Widget?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the widget and all associated response data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Tabs>
      </motion.div>
    </PageContainer>
  );
}
