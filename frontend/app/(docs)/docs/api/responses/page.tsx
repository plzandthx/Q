import Link from 'next/link';

export default function ApiResponsesPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/api/authentication" className="hover:text-neutral-700">API</Link>
        <span>/</span>
        <span className="text-neutral-900">Responses</span>
      </nav>

      <h1>Responses API</h1>
      <p className="lead">
        Query and manage survey responses programmatically.
      </p>

      <h2>List Responses</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`GET /v1/projects/:project_id/responses

// Query parameters
?start_date=2024-01-01
&end_date=2024-01-31
&score_min=1
&score_max=5
&page=1
&per_page=50

// Response
{
  "data": [
    {
      "id": "resp_abc123",
      "score": 5,
      "comment": "Great experience!",
      "user_id": "user_123",
      "metadata": {
        "order_id": "order_456"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1234,
    "page": 1,
    "per_page": 50
  }
}`}</code>
      </pre>

      <h2>Get Response</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`GET /v1/responses/:id

// Response
{
  "id": "resp_abc123",
  "project_id": "proj_456",
  "widget_id": "w_789",
  "score": 5,
  "comment": "Great experience!",
  "user_id": "user_123",
  "user_email": "user@example.com",
  "metadata": {
    "order_id": "order_456",
    "page_url": "https://example.com/checkout"
  },
  "created_at": "2024-01-15T10:30:00Z"
}`}</code>
      </pre>

      <h2>Create Response (Server-side)</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`POST /v1/responses
Content-Type: application/json

{
  "project_id": "proj_456",
  "score": 5,
  "comment": "Submitted via API",
  "user_id": "user_123",
  "metadata": {
    "source": "email_survey"
  }
}`}</code>
      </pre>

      <h2>Export Responses</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`GET /v1/projects/:project_id/responses/export

// Query parameters
?format=csv  // csv or json
&start_date=2024-01-01
&end_date=2024-01-31

// Response: CSV or JSON file download`}</code>
      </pre>

      <h2>Response Statistics</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`GET /v1/projects/:project_id/responses/stats

// Response
{
  "total_responses": 12543,
  "average_score": 4.2,
  "score_distribution": {
    "1": 467,
    "2": 876,
    "3": 1892,
    "4": 3876,
    "5": 5432
  },
  "response_rate": 0.34,
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}`}</code>
      </pre>
    </div>
  );
}
