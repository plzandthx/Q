import Link from 'next/link';

export default function ApiWebhooksPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/api/authentication" className="hover:text-neutral-700">API</Link>
        <span>/</span>
        <span className="text-neutral-900">Webhooks</span>
      </nav>

      <h1>Webhooks API</h1>
      <p className="lead">
        Manage webhook subscriptions programmatically.
      </p>

      <h2>List Webhooks</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`GET /v1/webhooks

// Response
{
  "data": [
    {
      "id": "wh_abc123",
      "url": "https://example.com/webhooks/qcsat",
      "events": ["response.created", "alert.triggered"],
      "active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}`}</code>
      </pre>

      <h2>Create Webhook</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`POST /v1/webhooks
Content-Type: application/json

{
  "url": "https://example.com/webhooks/qcsat",
  "events": ["response.created", "alert.triggered"],
  "secret": "your_webhook_secret"
}`}</code>
      </pre>

      <h2>Update Webhook</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`PATCH /v1/webhooks/:id
Content-Type: application/json

{
  "events": ["response.created"],
  "active": false
}`}</code>
      </pre>

      <h2>Delete Webhook</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`DELETE /v1/webhooks/:id

// Response: 204 No Content`}</code>
      </pre>

      <h2>Test Webhook</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`POST /v1/webhooks/:id/test

// Sends a test payload to your endpoint
// Response
{
  "success": true,
  "response_time_ms": 150,
  "status_code": 200
}`}</code>
      </pre>

      <h2>Webhook Logs</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`GET /v1/webhooks/:id/logs

// Response
{
  "data": [
    {
      "id": "log_123",
      "event": "response.created",
      "status": "delivered",
      "status_code": 200,
      "response_time_ms": 120,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}`}</code>
      </pre>
    </div>
  );
}
