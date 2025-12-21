'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  MoreVertical,
  Target,
  Copy,
  ExternalLink,
  Pencil,
  CheckCircle2,
  Pause,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  MomentCard,
  type CsatWidgetInfo,
  type FeedbackIntegration,
  type InsightsAutomation,
} from '@/components/domain/moment-card';
import { Logo } from '@/components/ui/logo';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';
import { formatCompact, formatScore } from '@/lib/utils';

// Types
interface Moment {
  id: string;
  name: string;
  description: string;
  iconEmoji?: string;
  score: number;
  responses: number;
  trend: number;
  status: 'active' | 'paused';
  csatWidget?: CsatWidgetInfo;
  feedbackIntegrations?: FeedbackIntegration[];
  insightsAutomation?: InsightsAutomation;
}

// Mock data with new structure
const moments: Moment[] = [
  {
    id: '1',
    name: 'After Purchase',
    description: 'Survey shown after completing a purchase',
    iconEmoji: '🛒',
    score: 4.8,
    responses: 2341,
    trend: 0.3,
    status: 'active',
    csatWidget: {
      id: 'w1',
      name: 'Post-Purchase Survey',
      type: 'custom',
      status: 'connected',
    },
    feedbackIntegrations: [
      { id: 'z1', name: 'Zendesk', icon: 'Z' },
      { id: 's1', name: 'Slack', icon: 'S' },
    ],
    insightsAutomation: { id: 'j1', name: 'Jira', icon: 'J' },
  },
  {
    id: '2',
    name: 'Onboarding Complete',
    description: 'Survey after user completes onboarding flow',
    iconEmoji: '🎓',
    score: 4.6,
    responses: 1856,
    trend: 0.1,
    status: 'active',
    csatWidget: {
      id: 'w2',
      name: 'Onboarding Feedback',
      type: 'custom',
      status: 'connected',
    },
    feedbackIntegrations: [
      { id: 'i1', name: 'Intercom', icon: 'I' },
    ],
    insightsAutomation: { id: 'a1', name: 'Asana', icon: 'A' },
  },
  {
    id: '3',
    name: 'Feature Discovery',
    description: 'Survey when user discovers a key feature',
    iconEmoji: '✨',
    score: 4.2,
    responses: 1234,
    trend: -0.2,
    status: 'active',
    csatWidget: {
      id: 'w3',
      name: 'Zendesk CSAT',
      type: 'integration',
      status: 'connected',
      integrationIcon: 'Z',
    },
    feedbackIntegrations: [
      { id: 'z2', name: 'Zendesk', icon: 'Z' },
      { id: 'h1', name: 'HubSpot', icon: 'H' },
      { id: 's2', name: 'Segment', icon: 'S' },
    ],
  },
  {
    id: '4',
    name: 'Support Interaction',
    description: 'Survey after support ticket resolution',
    iconEmoji: '💬',
    score: 3.9,
    responses: 3421,
    trend: 0.5,
    status: 'active',
    csatWidget: {
      id: 'w4',
      name: 'Support Rating Widget',
      type: 'custom',
      status: 'paused',
    },
    feedbackIntegrations: [
      { id: 'f1', name: 'Freshdesk', icon: 'F' },
    ],
    insightsAutomation: { id: 'l1', name: 'Linear', icon: 'L' },
  },
  {
    id: '5',
    name: 'Checkout Flow',
    description: 'Survey during checkout process',
    iconEmoji: '💳',
    score: 4.1,
    responses: 892,
    trend: -0.1,
    status: 'paused',
    csatWidget: {
      id: 'w5',
      name: 'Checkout Feedback',
      type: 'custom',
      status: 'issue',
    },
  },
];

// Moment Detail Flyout Component
interface MomentDetailFlyoutProps {
  moment: Moment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MomentDetailFlyout({ moment, open, onOpenChange }: MomentDetailFlyoutProps) {
  const [copied, setCopied] = useState(false);

  if (!moment) return null;

  const copyEmbedCode = () => {
    const embedCode = `<script src="https://cdn.qcsat.io/widget.js" data-widget-id="${moment.csatWidget?.id}"></script>`;
    void navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWidgetStatusBadge = (status: CsatWidgetInfo['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="secondary">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case 'issue':
        return (
          <Badge variant="danger">
            <AlertCircle className="h-3 w-3 mr-1" />
            Issue Connecting
          </Badge>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="lg">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
              {moment.iconEmoji || '🎯'}
            </div>
            <div>
              <SheetTitle>{moment.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <Badge variant={moment.status === 'active' ? 'success' : 'secondary'}>
                  {moment.status}
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <SheetBody className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-2">Description</h4>
            <p className="text-sm">{moment.description}</p>
          </div>

          <Separator />

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-medium text-neutral-500 mb-3">Performance</h4>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {formatScore(moment.score, 1)}
                  </p>
                  <p className="text-xs text-muted-foreground">CSAT Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCompact(moment.responses)}
                  </p>
                  <p className="text-xs text-muted-foreground">Responses</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className={`text-2xl font-bold ${moment.trend >= 0 ? 'text-success' : 'text-danger'}`}>
                    {moment.trend >= 0 ? '+' : ''}{formatScore(moment.trend, 1)}
                  </p>
                  <p className="text-xs text-muted-foreground">Trend</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* CSAT Widget */}
          {moment.csatWidget && (
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-3">CSAT Widget</h4>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        {moment.csatWidget.type === 'custom' ? (
                          <Logo size="sm" />
                        ) : (
                          <span className="text-lg font-bold text-neutral-600">
                            {moment.csatWidget.integrationIcon || 'I'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{moment.csatWidget.name}</span>
                          {getWidgetStatusBadge(moment.csatWidget.status)}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={copyEmbedCode}
                                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
                              >
                                <Copy className="h-3 w-3" />
                                {copied ? 'Embed code copied!' : 'Copy embed code'}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Embed code copied to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feedback Integrations */}
          {moment.feedbackIntegrations && moment.feedbackIntegrations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-3">Feedback Integrations</h4>
              <div className="space-y-2">
                {moment.feedbackIntegrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                            <span className="text-sm font-bold text-neutral-600">
                              {integration.icon}
                            </span>
                          </div>
                          <span className="font-medium">{integration.name}</span>
                        </div>
                        <Badge variant="success" size="sm">Connected</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>
          )}

          {/* Insights Automation */}
          {moment.insightsAutomation && (
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-3">Insights Automation</h4>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <span className="text-lg font-bold text-neutral-600">
                          {moment.insightsAutomation.icon}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">{moment.insightsAutomation.name}</span>
                        <p className="text-xs text-muted-foreground">
                          Syncing insights automatically
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={true} />
                      <Button variant="ghost" size="icon-sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Moment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Main Component
export function MomentsClient() {
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  const openMomentDetail = (moment: Moment) => {
    setSelectedMoment(moment);
    setFlyoutOpen(true);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
      className="space-y-6"
    >
      {/* Header Actions */}
      <motion.div
        variants={staggerItemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Moments That Matter
          </h2>
          <p className="text-sm text-neutral-500">
            Track satisfaction at critical touchpoints in the customer journey
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Moment
        </Button>
      </motion.div>

      {/* Moments Grid */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
      >
        {moments.map((moment) => (
          <motion.div key={moment.id} variants={staggerItemVariants}>
            <MomentCard
              name={moment.name}
              description={moment.description}
              iconEmoji={moment.iconEmoji}
              score={moment.score}
              responses={moment.responses}
              trend={moment.trend}
              status={moment.status}
              csatWidget={moment.csatWidget}
              feedbackIntegrations={moment.feedbackIntegrations}
              insightsAutomation={moment.insightsAutomation}
              onClick={() => openMomentDetail(moment)}
              onEdit={() => openMomentDetail(moment)}
              actions={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openMomentDetail(moment)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                    <DropdownMenuItem>
                      {moment.status === 'active' ? 'Pause' : 'Activate'}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Tips Card */}
      <motion.div variants={staggerItemVariants}>
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <Target className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">
                  Best practices for Moments That Matter
                </h3>
                <ul className="mt-2 text-sm text-neutral-600 space-y-1">
                  <li>Focus on high-impact touchpoints like purchases, support, and onboarding</li>
                  <li>Limit surveys to avoid fatigue - aim for 1 survey per user session</li>
                  <li>Use specific triggers for better targeting and higher response rates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Moment Detail Flyout */}
      <MomentDetailFlyout
        moment={selectedMoment}
        open={flyoutOpen}
        onOpenChange={setFlyoutOpen}
      />
    </motion.div>
  );
}
