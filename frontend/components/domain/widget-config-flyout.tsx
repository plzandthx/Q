'use client';

import { useState } from 'react';
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
  Link2,
  Sparkles,
  ExternalLink,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const widgetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  question: z.string().min(5, 'Question must be at least 5 characters'),
  isActive: z.boolean(),
  position: z.string(),
  primaryColor: z.string(),
  showBranding: z.boolean(),
  trigger: z.string(),
  delay: z.number().min(0),
});

type WidgetForm = z.infer<typeof widgetSchema>;

export interface Widget {
  id: string;
  name: string;
  project: string;
  projectId?: string;
  moment?: string;
  momentId?: string;
  type: 'popup' | 'inline' | 'slide-in';
  status: 'active' | 'paused';
  question?: string;
  ratingType?: string;
  responses: number;
  position: string;
  primaryColor?: string;
  showBranding?: boolean;
  trigger?: string;
  delay?: number;
  embedCode?: string;
}

interface WidgetConfigFlyoutProps {
  widget: Widget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (widget: Widget, data: WidgetForm) => Promise<void>;
  onDelete?: (widgetId: string) => Promise<void>;
}

export function WidgetConfigFlyout({
  widget,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: WidgetConfigFlyoutProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<WidgetForm>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      name: widget?.name || '',
      question: widget?.question || 'How satisfied are you with your experience?',
      isActive: widget?.status === 'active',
      position: widget?.position || 'bottom-right',
      primaryColor: widget?.primaryColor || '#14b8a6',
      showBranding: widget?.showBranding ?? true,
      trigger: widget?.trigger || 'page_load',
      delay: widget?.delay || 3,
    },
  });

  // Reset form when widget changes
  useState(() => {
    if (widget) {
      reset({
        name: widget.name,
        question: widget.question || 'How satisfied are you with your experience?',
        isActive: widget.status === 'active',
        position: widget.position,
        primaryColor: widget.primaryColor || '#14b8a6',
        showBranding: widget.showBranding ?? true,
        trigger: widget.trigger || 'page_load',
        delay: widget.delay || 3,
      });
    }
  });

  const isActive = watch('isActive');

  const onSubmit = async (data: WidgetForm) => {
    if (widget && onSave) {
      await onSave(widget, data);
    }
    onOpenChange(false);
  };

  const embedCode = widget?.embedCode || `<script src="https://cdn.qcsat.io/widget.js" data-widget-id="w_${widget?.id}"></script>`;

  const copyEmbedCode = () => {
    void navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (widget && onDelete) {
      await onDelete(widget.id);
    }
    onOpenChange(false);
  };

  if (!widget) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="1/3" className="p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3 pr-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <Code className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="truncate">{widget.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{widget.type}</Badge>
                <Badge variant={isActive ? 'success' : 'secondary'} className="text-xs">
                  {isActive ? 'Active' : 'Paused'}
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <SheetBody className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4 border-b">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="overview" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="appearance" className="text-xs">
                  <Palette className="h-3 w-3 mr-1" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="embed" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  Embed
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                {/* Overview Tab */}
                <TabsContent value="overview" className="m-0 p-6 space-y-6">
                  {/* Widget Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) =>
                            setValue('isActive', checked, { shouldDirty: true })
                          }
                        />
                        <span className="text-sm font-medium">
                          {isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Project</span>
                        <div className="flex items-center gap-1">
                          <Link2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{widget.project}</span>
                        </div>
                      </div>

                      {widget.moment && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Moment</span>
                          <span className="text-sm font-medium">{widget.moment}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Widget Type</span>
                        <Badge variant="outline">{widget.type}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Position</span>
                        <span className="text-sm font-medium capitalize">
                          {widget.position.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Stats */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Performance
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold text-primary-600">
                            {widget.responses.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Responses</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold text-primary-600">4.3</p>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3 text-center">
                          <p className="text-2xl font-bold text-primary-600">23%</p>
                          <p className="text-xs text-muted-foreground">Response Rate</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Widget
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyEmbedCode}>
                        <Copy className="mr-2 h-4 w-4" />
                        {copied ? 'Copied!' : 'Copy Code'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="m-0 p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Widget Name
                      </label>
                      <Input {...register('name')} />
                      {errors.name && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Survey Question
                      </label>
                      <Textarea rows={3} {...register('question')} />
                      {errors.question && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.question.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Position
                      </label>
                      <Select
                        defaultValue={widget.position}
                        onValueChange={(value) =>
                          setValue('position', value, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Trigger
                      </label>
                      <Select
                        defaultValue={widget.trigger || 'page_load'}
                        onValueChange={(value) =>
                          setValue('trigger', value, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="page_load">On Page Load</SelectItem>
                          <SelectItem value="time_delay">After Time Delay</SelectItem>
                          <SelectItem value="scroll">On Scroll Percentage</SelectItem>
                          <SelectItem value="exit_intent">On Exit Intent</SelectItem>
                          <SelectItem value="custom_event">Custom Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Delay (seconds)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        {...register('delay', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="m-0 p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          {...register('primaryColor')}
                          className="h-10 w-16 cursor-pointer rounded border"
                        />
                        <Input
                          {...register('primaryColor')}
                          className="w-32"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Q CSAT Branding</p>
                        <p className="text-sm text-muted-foreground">
                          Display &quot;Powered by Q CSAT&quot; in widget
                        </p>
                      </div>
                      <Switch
                        checked={watch('showBranding')}
                        onCheckedChange={(checked) =>
                          setValue('showBranding', checked, { shouldDirty: true })
                        }
                      />
                    </div>
                  </div>

                  {/* Preview placeholder */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Widget preview coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Embed Tab */}
                <TabsContent value="embed" className="m-0 p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Embed Code</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Copy this code and paste it into your website before the closing &lt;/body&gt; tag.
                    </p>
                    <div className="relative">
                      <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-lg text-xs overflow-x-auto">
                        {embedCode}
                      </pre>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={copyEmbedCode}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Widget ID</h4>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      w_{widget.id}
                    </code>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Public Key</h4>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      pk_live_{widget.id.substring(0, 8)}
                    </code>
                  </div>
                </TabsContent>

                {/* Save button shown when form is dirty */}
                {isDirty && (
                  <div className="px-6 py-4 border-t bg-muted/50">
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </Tabs>
        </SheetBody>

        <SheetFooter className="border-t px-6 py-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Widget
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Widget?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the widget
                  &quot;{widget.name}&quot; and all associated response data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
