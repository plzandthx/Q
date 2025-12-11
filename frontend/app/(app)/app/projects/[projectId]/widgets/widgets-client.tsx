'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Copy, Code, Settings, CheckCircle2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';
import { WidgetConfigFlyout, type Widget } from '@/components/domain/widget-config-flyout';

// Mock moments for the project
const projectMoments = [
  { id: 'm1', name: 'App Launch', description: 'When user opens the app' },
  { id: 'm2', name: 'Post Purchase', description: 'After completing a purchase' },
  { id: 'm3', name: 'Feature Discovery', description: 'When user finds a new feature' },
];

// TODO: Replace with API data - widgets for this specific project
const initialWidgets: Widget[] = [
  {
    id: '1',
    name: 'Main Survey Widget',
    project: 'Mobile App',
    projectId: '1',
    moment: 'Post Purchase',
    momentId: 'm2',
    type: 'popup',
    status: 'active',
    responses: 8234,
    position: 'bottom-right',
    question: 'How satisfied are you with your purchase?',
    primaryColor: '#14b8a6',
    showBranding: true,
    trigger: 'page_load',
    delay: 3,
  },
  {
    id: '2',
    name: 'Inline Feedback',
    project: 'Mobile App',
    projectId: '1',
    moment: 'App Launch',
    momentId: 'm1',
    type: 'inline',
    status: 'active',
    responses: 2341,
    position: 'embedded',
    question: 'How are you finding the app today?',
    primaryColor: '#3b82f6',
    showBranding: false,
    trigger: 'page_load',
    delay: 0,
  },
];

const embedCode = `<script src="https://cdn.qcsat.io/widget.js"></script>
<script>
  QCSATWidget.init({
    projectId: 'proj_abc123',
    position: 'bottom-right',
    primaryColor: '#14b8a6'
  });
</script>`;

export function WidgetsClient() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  const handleConfigureClick = (widget: Widget) => {
    setSelectedWidget(widget);
    setFlyoutOpen(true);
  };

  const handleSaveWidget = async (widget: Widget, data: unknown) => {
    console.log('Saving widget:', widget.id, data);
    setWidgets(widgets.map(w =>
      w.id === widget.id
        ? { ...w, ...data as Partial<Widget> }
        : w
    ));
  };

  const handleDeleteWidget = async (widgetId: string) => {
    console.log('Deleting widget:', widgetId);
    setWidgets(widgets.filter(w => w.id !== widgetId));
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
            Survey Widgets
          </h2>
          <p className="text-sm text-neutral-500">
            Configure and embed feedback widgets for this project. Each widget is tied to a specific Moment That Matters.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Widget
        </Button>
      </motion.div>

      {/* Widgets List */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid gap-4"
      >
        {widgets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Code className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
              <h3 className="font-semibold text-neutral-900">No widgets yet</h3>
              <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                Create a widget to start collecting CSAT feedback for your Moments That Matter.
              </p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create First Widget
              </Button>
            </CardContent>
          </Card>
        ) : (
          widgets.map((widget) => (
            <motion.div key={widget.id} variants={staggerItemVariants}>
              <Card className="hover:border-primary-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                        <Code className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleConfigureClick(widget)}
                            className="font-semibold text-neutral-900 hover:text-primary-600 text-left"
                          >
                            {widget.name}
                          </button>
                          <Badge variant="outline">{widget.type}</Badge>
                          <Badge
                            variant={widget.status === 'active' ? 'success' : 'secondary'}
                          >
                            {widget.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {widget.moment && (
                            <span className="text-sm text-primary-600 font-medium">
                              {widget.moment}
                            </span>
                          )}
                          <span className="text-sm text-neutral-500">
                            • {widget.responses.toLocaleString()} responses
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfigureClick(widget)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code className="mr-2 h-4 w-4" />
                        Get Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Moments Overview - Show which moments have widgets */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Moments That Matter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-500 mb-4">
              Widgets are tied to specific Moments That Matter. Create widgets to capture CSAT feedback at each critical touchpoint.
            </p>
            <div className="space-y-3">
              {projectMoments.map((moment) => {
                const momentWidgets = widgets.filter(w => w.momentId === moment.id);
                return (
                  <div
                    key={moment.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{moment.name}</p>
                      <p className="text-sm text-neutral-500">{moment.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {momentWidgets.length > 0 ? (
                        <Badge variant="success">
                          {momentWidgets.length} widget{momentWidgets.length > 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No widget</Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Embed Code Section */}
      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Embed Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript">
              <TabsList>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="npm">NPM Package</TabsTrigger>
              </TabsList>
              <TabsContent value="javascript" className="mt-4">
                <div className="relative">
                  <pre className="rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100 overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => navigator.clipboard.writeText(embedCode)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="react" className="mt-4">
                <pre className="rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100 overflow-x-auto">
                  <code>{`import { QCSATWidget } from '@qcsat/react';

<QCSATWidget
  projectId="proj_abc123"
  position="bottom-right"
/>`}</code>
                </pre>
              </TabsContent>
              <TabsContent value="npm" className="mt-4">
                <pre className="rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100 overflow-x-auto">
                  <code>{`npm install @qcsat/widget

# or

yarn add @qcsat/widget`}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Installation Guide */}
      <motion.div variants={staggerItemVariants}>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-neutral-900">
                  Quick Installation Guide
                </h3>
                <ol className="mt-2 text-sm text-neutral-600 space-y-2">
                  <li>1. Copy the embed code above</li>
                  <li>2. Paste it before the closing &lt;/body&gt; tag of your website</li>
                  <li>3. The widget will automatically appear based on your trigger settings</li>
                  <li>4. Responses will start appearing in your dashboard immediately</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Widget Configuration Flyout */}
      <WidgetConfigFlyout
        widget={selectedWidget}
        open={flyoutOpen}
        onOpenChange={setFlyoutOpen}
        onSave={handleSaveWidget}
        onDelete={handleDeleteWidget}
      />
    </motion.div>
  );
}
