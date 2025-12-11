import Link from 'next/link';

export default function WidgetEmbedPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/widgets/overview" className="hover:text-neutral-700">Widgets</Link>
        <span>/</span>
        <span className="text-neutral-900">Embed Guide</span>
      </nav>

      <h1>Widget Embed Guide</h1>
      <p className="lead">
        Learn how to embed Q CSAT widgets on your website, app, or email.
      </p>

      <h2>Script Embed</h2>
      <p>The simplest way to add a widget to your website:</p>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`<script
  src="https://cdn.qcsat.io/widget.js"
  data-widget-id="w_abc123"
  async
></script>`}</code>
      </pre>

      <h2>React Component</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`import { QCSATWidget } from '@qcsat/widget/react';

<QCSATWidget widgetId="w_abc123" />`}</code>
      </pre>

      <h2>Programmatic Trigger</h2>
      <p>Show the widget programmatically after a specific action:</p>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// After the script loads
window.QCSAT.show({
  widgetId: 'w_abc123',
  userId: 'user_123',
  metadata: {
    orderId: 'order_456'
  }
});`}</code>
      </pre>

      <h2>Email Embed</h2>
      <p>
        For email surveys, use our hosted survey page URL:
      </p>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`https://survey.qcsat.io/w_abc123?user=user_123`}</code>
      </pre>

      <h2>Next Steps</h2>
      <ul>
        <li><Link href="/docs/widgets/customization">Customize your widget</Link></li>
        <li><Link href="/docs/api/responses">Track responses via API</Link></li>
      </ul>
    </div>
  );
}
