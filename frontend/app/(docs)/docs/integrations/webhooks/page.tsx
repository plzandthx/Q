import Link from 'next/link';

export default function WebhooksPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/integrations/overview" className="hover:text-neutral-700">Integrations</Link>
        <span>/</span>
        <span className="text-neutral-900">Webhooks</span>
      </nav>

      <h1>Webhooks</h1>
      <p className="lead">
        Send CSAT data to any endpoint with custom webhooks.
      </p>

      <h2>Setting Up Webhooks</h2>
      <ol>
        <li>Go to <Link href="/app/integrations">Integrations</Link></li>
        <li>Click on &quot;Webhooks&quot;</li>
        <li>Click &quot;Add Webhook&quot;</li>
        <li>Enter your endpoint URL</li>
        <li>Select the events to subscribe to</li>
        <li>Save and test</li>
      </ol>

      <h2>Event Types</h2>
      <ul>
        <li><code>response.created</code> - New survey response received</li>
        <li><code>response.updated</code> - Response was modified</li>
        <li><code>alert.triggered</code> - CSAT alert was triggered</li>
        <li><code>project.updated</code> - Project settings changed</li>
      </ul>

      <h2>Payload Format</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`{
  "event": "response.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "resp_abc123",
    "score": 5,
    "comment": "Great service!",
    "userId": "user_123",
    "projectId": "proj_456",
    "widgetId": "w_789",
    "metadata": {
      "orderId": "order_123"
    }
  }
}`}</code>
      </pre>

      <h2>Security</h2>
      <p>Verify webhook authenticity using the signature header:</p>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`X-QCSAT-Signature: sha256=abc123...`}</code>
      </pre>

      <h2>Retry Policy</h2>
      <ul>
        <li>Failed webhooks are retried up to 5 times</li>
        <li>Exponential backoff: 1min, 5min, 30min, 2hr, 24hr</li>
        <li>View delivery logs in your dashboard</li>
      </ul>
    </div>
  );
}
