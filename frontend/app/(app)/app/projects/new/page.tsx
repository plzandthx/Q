'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  GripVertical,
  Check,
  ExternalLink,
  Copy,
  Pencil,
  Sparkles,
  AlertCircle,
  Pause,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PageContainer, PageHeader } from '@/components/layout';
import { Logo } from '@/components/ui/logo';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// ============================================================================
// Types
// ============================================================================

interface CsatWidget {
  id: string;
  name: string;
  type: 'custom' | 'integration';
  status: 'connected' | 'paused' | 'issue';
  integrationName?: string;
  embedCode?: string;
}

interface Moment {
  id: string;
  name: string;
  widget?: CsatWidget;
}

interface InsightsIntegration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'paused' | 'issue';
  enabled: boolean;
}

// ============================================================================
// Form Schema
// ============================================================================

const projectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

// ============================================================================
// Mock Data - Existing Q Widgets
// ============================================================================

const existingQWidgets: CsatWidget[] = [
  { id: 'w1', name: 'Post-Purchase Survey', type: 'custom', status: 'connected' },
  { id: 'w2', name: 'Checkout Feedback', type: 'custom', status: 'connected' },
  { id: 'w3', name: 'Support Rating', type: 'custom', status: 'paused' },
];

const csatIntegrations = [
  { id: 'zendesk', name: 'Zendesk', icon: 'Z' },
  { id: 'intercom', name: 'Intercom', icon: 'I' },
  { id: 'freshdesk', name: 'Freshdesk', icon: 'F' },
  { id: 'helpscout', name: 'Help Scout', icon: 'H' },
  { id: 'hubspot', name: 'HubSpot', icon: 'H' },
  { id: 'salesforce', name: 'Salesforce', icon: 'S' },
];

const insightsIntegrationOptions = [
  { id: 'jira', name: 'Jira', icon: 'J', description: 'Sync insights to Jira issues' },
  { id: 'asana', name: 'Asana', icon: 'A', description: 'Create tasks from feedback themes' },
  { id: 'airtable', name: 'Airtable', icon: 'A', description: 'Export insights to Airtable bases' },
  { id: 'notion', name: 'Notion', icon: 'N', description: 'Push recommendations to Notion' },
  { id: 'linear', name: 'Linear', icon: 'L', description: 'Create Linear issues from insights' },
  { id: 'monday', name: 'Monday.com', icon: 'M', description: 'Sync to Monday boards' },
];

// ============================================================================
// Sortable Moment Item Component
// ============================================================================

interface SortableMomentItemProps {
  moment: Moment;
  onDelete: (id: string) => void;
  onConfigureWidget: (moment: Moment) => void;
  onEditWidget: (moment: Moment) => void;
}

function SortableMomentItem({
  moment,
  onDelete,
  onConfigureWidget,
  onEditWidget,
}: SortableMomentItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: moment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [copied, setCopied] = useState(false);

  const copyEmbedCode = () => {
    if (moment.widget?.embedCode) {
      void navigator.clipboard.writeText(moment.widget.embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: CsatWidget['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="secondary" size="sm">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case 'issue':
        return (
          <Badge variant="danger" size="sm">
            <AlertCircle className="h-3 w-3 mr-1" />
            Issue Connecting
          </Badge>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          className="mt-1 cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎯</span>
            <h4 className="font-medium text-neutral-900">{moment.name}</h4>
          </div>

          {moment.widget ? (
            <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    {moment.widget.type === 'custom' ? (
                      <Logo size="xs" />
                    ) : (
                      <span className="text-sm font-bold text-neutral-600">
                        {moment.widget.integrationName?.[0] || 'I'}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{moment.widget.name}</span>
                      {getStatusBadge(moment.widget.status)}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={copyEmbedCode}
                            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-0.5"
                          >
                            <Copy className="h-3 w-3" />
                            {copied ? 'Copied!' : 'Copy embed code'}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Embed code copied to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEditWidget(moment)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => onConfigureWidget(moment)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add CSAT Widget
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="text-neutral-400 hover:text-red-500"
          onClick={() => onDelete(moment.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Widget Configuration Drawer
// ============================================================================

interface WidgetConfigDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moment: Moment | null;
  onSave: (momentId: string, widget: CsatWidget) => void;
  existingWidgets: CsatWidget[];
}

function WidgetConfigDrawer({
  open,
  onOpenChange,
  moment,
  onSave,
  existingWidgets,
}: WidgetConfigDrawerProps) {
  const [widgetType, setWidgetType] = useState<'custom' | 'integration'>('custom');
  const [selectedWidget, setSelectedWidget] = useState<string>('');
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [showCreateWidget, setShowCreateWidget] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState('');

  const handleSave = () => {
    if (!moment) return;

    if (widgetType === 'custom') {
      if (showCreateWidget && newWidgetName) {
        // Create new widget
        const newWidget: CsatWidget = {
          id: `w-${Date.now()}`,
          name: newWidgetName,
          type: 'custom',
          status: 'connected',
          embedCode: `<script src="https://cdn.qcsat.io/widget.js" data-widget-id="w-${Date.now()}"></script>`,
        };
        onSave(moment.id, newWidget);
      } else if (selectedWidget) {
        const widget = existingWidgets.find((w) => w.id === selectedWidget);
        if (widget) {
          onSave(moment.id, {
            ...widget,
            embedCode: `<script src="https://cdn.qcsat.io/widget.js" data-widget-id="${widget.id}"></script>`,
          });
        }
      }
    } else if (selectedIntegration) {
      const integration = csatIntegrations.find((i) => i.id === selectedIntegration);
      if (integration) {
        onSave(moment.id, {
          id: `int-${Date.now()}`,
          name: `${integration.name} CSAT`,
          type: 'integration',
          status: 'connected',
          integrationName: integration.name,
          embedCode: `<!-- ${integration.name} CSAT integration active -->`,
        });
      }
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setWidgetType('custom');
    setSelectedWidget('');
    setSelectedIntegration('');
    setShowCreateWidget(false);
    setNewWidgetName('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="lg">
        <SheetHeader>
          <SheetTitle>Configure CSAT Widget</SheetTitle>
          <SheetDescription>
            {moment ? `Add a CSAT collection widget to "${moment.name}"` : 'Configure widget'}
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-6">
          {/* Segmented Control */}
          <Tabs value={widgetType} onValueChange={(v) => setWidgetType(v as 'custom' | 'integration')}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="custom">Custom Q Widget</TabsTrigger>
              <TabsTrigger value="integration">CSAT Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="custom" className="mt-6 space-y-4">
              {!showCreateWidget ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Select Existing Widget
                    </label>
                    {existingWidgets.length > 0 ? (
                      <Select value={selectedWidget} onValueChange={setSelectedWidget}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a widget..." />
                        </SelectTrigger>
                        <SelectContent>
                          {existingWidgets.map((widget) => (
                            <SelectItem key={widget.id} value={widget.id}>
                              <div className="flex items-center gap-2">
                                <Logo size="xs" />
                                <span>{widget.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-4 bg-neutral-50 rounded-lg text-center">
                        <p className="text-sm text-neutral-500 mb-3">
                          No Q widgets created yet
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowCreateWidget(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Q Widget
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateWidget(false)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <span className="text-sm font-medium">Create New Widget</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Widget Name
                    </label>
                    <Input
                      value={newWidgetName}
                      onChange={(e) => setNewWidgetName(e.target.value)}
                      placeholder="e.g., Post-Purchase Survey"
                    />
                  </div>

                  <Card className="bg-primary-50 border-primary-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-primary-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            Widget Configuration
                          </p>
                          <p className="text-xs text-neutral-600 mt-1">
                            After creating this project, you can customize the widget&apos;s
                            appearance, questions, and trigger settings in the Widgets section.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="integration" className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Integration
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {csatIntegrations.map((integration) => (
                    <button
                      key={integration.id}
                      onClick={() => setSelectedIntegration(integration.id)}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        selectedIntegration === integration.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-neutral-600">
                            {integration.icon}
                          </span>
                        </div>
                        <span className="font-medium">{integration.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedIntegration && (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-neutral-600">
                      Connecting to{' '}
                      {csatIntegrations.find((i) => i.id === selectedIntegration)?.name} will
                      allow Q to collect CSAT data from your existing surveys.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Authorize Integration
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              (widgetType === 'custom' && !selectedWidget && (!showCreateWidget || !newWidgetName)) ||
              (widgetType === 'integration' && !selectedIntegration)
            }
          >
            <Check className="h-4 w-4 mr-2" />
            Save Widget
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Moments state
  const [moments, setMoments] = useState<Moment[]>([]);
  const [newMomentName, setNewMomentName] = useState('');
  const [widgetDrawerOpen, setWidgetDrawerOpen] = useState(false);
  const [selectedMomentForWidget, setSelectedMomentForWidget] = useState<Moment | null>(null);

  // Insights integrations state
  const [insightsIntegrations, setInsightsIntegrations] = useState<InsightsIntegration[]>([]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const projectName = watch('name');

  // Moment handlers
  const addMoment = () => {
    if (newMomentName.trim()) {
      setMoments([
        ...moments,
        {
          id: `moment-${Date.now()}`,
          name: newMomentName.trim(),
        },
      ]);
      setNewMomentName('');
    }
  };

  const deleteMoment = (id: string) => {
    setMoments(moments.filter((m) => m.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMoments((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const openWidgetConfig = (moment: Moment) => {
    setSelectedMomentForWidget(moment);
    setWidgetDrawerOpen(true);
  };

  const saveWidget = (momentId: string, widget: CsatWidget) => {
    setMoments(
      moments.map((m) =>
        m.id === momentId ? { ...m, widget } : m
      )
    );
  };

  // Insights integration handlers
  const toggleInsightsIntegration = (integrationId: string) => {
    const existing = insightsIntegrations.find((i) => i.id === integrationId);
    if (existing) {
      setInsightsIntegrations(
        insightsIntegrations.map((i) =>
          i.id === integrationId ? { ...i, enabled: !i.enabled } : i
        )
      );
    } else {
      const integration = insightsIntegrationOptions.find((i) => i.id === integrationId);
      if (integration) {
        setInsightsIntegrations([
          ...insightsIntegrations,
          {
            id: integration.id,
            name: integration.name,
            icon: integration.icon,
            status: 'connected',
            enabled: true,
          },
        ]);
      }
    }
  };

  const onSubmit = async (data: ProjectForm) => {
    // TODO: Implement project creation API call
    console.log('Create project:', {
      ...data,
      moments,
      insightsIntegrations,
    });
    // Redirect to project overview
    router.push('/app/projects/1/overview');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return projectName && projectName.length >= 2;
      case 2:
        return true; // Moments are optional
      case 3:
        return true; // Insights integrations are optional
      case 4:
        return true;
      default:
        return false;
    }
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
        className="max-w-3xl mx-auto"
      >
        {/* Progress Indicator */}
        <motion.div variants={staggerItemVariants} className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    step >= s
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {index < 3 && (
                  <div
                    className={`h-1 w-12 rounded mx-2 transition-colors ${
                      step > s ? 'bg-primary-500' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-6 text-xs text-neutral-500">
            <span className={step === 1 ? 'text-primary-600 font-medium' : ''}>Basic Info</span>
            <span className={step === 2 ? 'text-primary-600 font-medium' : ''}>Moments & Widgets</span>
            <span className={step === 3 ? 'text-primary-600 font-medium' : ''}>Insights</span>
            <span className={step === 4 ? 'text-primary-600 font-medium' : ''}>Review</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
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
                    <CardDescription>
                      Give your project a name and optional description.
                    </CardDescription>
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
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!canProceed()}
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Moments That Matter */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Moments That Matter</CardTitle>
                    <CardDescription>
                      Define the key touchpoints where you want to collect CSAT feedback.
                      You can drag to reorder them.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Moment Input */}
                    <div className="flex gap-2">
                      <Input
                        value={newMomentName}
                        onChange={(e) => setNewMomentName(e.target.value)}
                        placeholder="e.g., After Purchase, Onboarding Complete"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addMoment();
                          }
                        }}
                      />
                      <Button type="button" onClick={addMoment} disabled={!newMomentName.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {/* Moments List */}
                    {moments.length > 0 ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={moments.map((m) => m.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {moments.map((moment) => (
                              <SortableMomentItem
                                key={moment.id}
                                moment={moment}
                                onDelete={deleteMoment}
                                onConfigureWidget={openWidgetConfig}
                                onEditWidget={openWidgetConfig}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="text-center py-12 bg-neutral-50 rounded-lg">
                        <p className="text-neutral-500">
                          No moments added yet. Add your first moment above.
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
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

            {/* Step 3: Insights Automation */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Insights Automation</CardTitle>
                    <CardDescription>
                      Connect roadmap tools to automatically publish feedback themes and
                      recommendations from Q.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      {insightsIntegrationOptions.map((integration) => {
                        const connected = insightsIntegrations.find(
                          (i) => i.id === integration.id
                        );
                        return (
                          <Card
                            key={integration.id}
                            className={`transition-colors ${
                              connected?.enabled
                                ? 'border-primary-300 bg-primary-50/50'
                                : ''
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                                    <span className="text-xl font-bold text-neutral-600">
                                      {integration.icon}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{integration.name}</h4>
                                      {connected && (
                                        <Badge
                                          variant={
                                            connected.status === 'connected'
                                              ? 'success'
                                              : connected.status === 'paused'
                                              ? 'secondary'
                                              : 'danger'
                                          }
                                          size="sm"
                                        >
                                          {connected.status === 'connected'
                                            ? 'Connected'
                                            : connected.status === 'paused'
                                            ? 'Paused'
                                            : 'Issue'}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-neutral-500">
                                      {integration.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {connected ? (
                                    <>
                                      <Switch
                                        checked={connected.enabled}
                                        onCheckedChange={() =>
                                          toggleInsightsIntegration(integration.id)
                                        }
                                      />
                                      <Button variant="ghost" size="icon-sm">
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        // In real app, this would open OAuth flow
                                        toggleInsightsIntegration(integration.id);
                                      }}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Activate
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" onClick={() => setStep(4)}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Review & Create */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Create Project</CardTitle>
                    <CardDescription>
                      Review your project configuration before creating.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Project Info */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-2">
                        Project Details
                      </h4>
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <p className="font-medium text-lg">{projectName}</p>
                        {watch('description') && (
                          <p className="text-neutral-600 mt-1">{watch('description')}</p>
                        )}
                      </div>
                    </div>

                    {/* Moments Summary */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-2">
                        Moments That Matter ({moments.length})
                      </h4>
                      {moments.length > 0 ? (
                        <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                          {moments.map((moment, index) => (
                            <div
                              key={moment.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-neutral-400">{index + 1}.</span>
                                <span className="text-lg">🎯</span>
                                <span>{moment.name}</span>
                              </div>
                              {moment.widget && (
                                <Badge variant="outline" size="sm">
                                  {moment.widget.type === 'custom' ? 'Q Widget' : 'Integration'}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-sm">No moments configured</p>
                      )}
                    </div>

                    {/* Insights Integrations Summary */}
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-2">
                        Insights Automation ({insightsIntegrations.filter((i) => i.enabled).length})
                      </h4>
                      {insightsIntegrations.filter((i) => i.enabled).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {insightsIntegrations
                            .filter((i) => i.enabled)
                            .map((integration) => (
                              <Badge key={integration.id} variant="secondary">
                                {integration.name}
                              </Badge>
                            ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 text-sm">No integrations enabled</p>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(3)}
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
          </AnimatePresence>
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

      {/* Widget Configuration Drawer */}
      <WidgetConfigDrawer
        open={widgetDrawerOpen}
        onOpenChange={setWidgetDrawerOpen}
        moment={selectedMomentForWidget}
        onSave={saveWidget}
        existingWidgets={existingQWidgets}
      />
    </PageContainer>
  );
}
