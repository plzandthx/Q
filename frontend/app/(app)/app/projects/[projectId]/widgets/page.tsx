'use client';

import { motion } from 'framer-motion';
import { Plus, Copy, Code, Settings, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const widgets = [
  {
    id: '1',
    name: 'Main Survey Widget',
    type: 'popup',
    status: 'active',
    responses: 8234,
    position: 'bottom-right',
  },
  {
    id: '2',
    name: 'Inline Feedback',
    type: 'inline',
    status: 'active',
    responses: 2341,
    position: 'embedded',
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

export default function ProjectWidgetsPage() {
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
            Configure and embed feedback widgets for this project
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
        {widgets.map((widget) => (
          <motion.div key={widget.id} variants={staggerItemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <Code className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {widget.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{widget.type}</Badge>
                        <Badge
                          variant={widget.status === 'active' ? 'default' : 'secondary'}
                        >
                          {widget.status}
                        </Badge>
                        <span className="text-sm text-neutral-500">
                          {widget.responses.toLocaleString()} responses
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
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
        ))}
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
    </motion.div>
  );
}
