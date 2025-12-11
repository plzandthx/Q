import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InstallationPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">
          Docs
        </Link>
        <span>/</span>
        <Link href="/docs/getting-started/quick-start" className="hover:text-neutral-700">
          Getting Started
        </Link>
        <span>/</span>
        <span className="text-neutral-900">Installation</span>
      </nav>

      <h1>Installation</h1>
      <p className="lead">
        Learn how to install and configure the Q CSAT widget on your website or
        application.
      </p>

      <h2>Quick Installation</h2>
      <p>
        The fastest way to add Q CSAT to your site is with our embed script. Add
        this code just before your closing <code>&lt;/body&gt;</code> tag:
      </p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`<script
  src="https://cdn.qcsat.io/widget.js"
  data-widget-id="YOUR_WIDGET_ID"
  async
></script>`}</code>
      </pre>

      <h2>NPM Package</h2>
      <p>
        For React, Vue, or other JavaScript frameworks, install our NPM package:
      </p>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`npm install @qcsat/widget`}</code>
      </pre>

      <h3>React Integration</h3>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`import { QCSATWidget } from '@qcsat/widget/react';

function App() {
  return (
    <div>
      <QCSATWidget
        widgetId="YOUR_WIDGET_ID"
        position="bottom-right"
      />
    </div>
  );
}`}</code>
      </pre>

      <h3>Vue Integration</h3>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`<template>
  <QCSATWidget
    widget-id="YOUR_WIDGET_ID"
    position="bottom-right"
  />
</template>

<script setup>
import { QCSATWidget } from '@qcsat/widget/vue';
</script>`}</code>
      </pre>

      <h2>Configuration Options</h2>

      <Card className="not-prose my-6">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-neutral-50">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Option
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Default
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 text-sm font-mono">widgetId</td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm">
                  <Badge variant="secondary">required</Badge>
                </td>
                <td className="px-4 py-3 text-sm">Your widget ID from the dashboard</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono">position</td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm font-mono">&quot;bottom-right&quot;</td>
                <td className="px-4 py-3 text-sm">Widget position on the page</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono">delay</td>
                <td className="px-4 py-3 text-sm">number</td>
                <td className="px-4 py-3 text-sm font-mono">0</td>
                <td className="px-4 py-3 text-sm">Delay in ms before showing widget</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono">userId</td>
                <td className="px-4 py-3 text-sm">string</td>
                <td className="px-4 py-3 text-sm font-mono">null</td>
                <td className="px-4 py-3 text-sm">Associate responses with a user</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <h2>Verification</h2>
      <p>
        To verify your installation is working correctly:
      </p>
      <ol>
        <li>Open your website in a browser</li>
        <li>Open the browser developer console</li>
        <li>
          Look for the message: <code>Q CSAT Widget initialized</code>
        </li>
        <li>Check your Q CSAT dashboard for incoming events</li>
      </ol>

      <h2>Next Steps</h2>
      <p>
        Now that you have the widget installed, learn how to:
      </p>
      <ul>
        <li>
          <Link href="/docs/widgets/customization">
            Customize the widget appearance
          </Link>
        </li>
        <li>
          <Link href="/docs/projects/moments">
            Set up survey triggers
          </Link>
        </li>
        <li>
          <Link href="/docs/integrations/overview">
            Connect integrations
          </Link>
        </li>
      </ul>
    </div>
  );
}
