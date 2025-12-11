import Link from 'next/link';

export default function ApiProjectsPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/api/authentication" className="hover:text-neutral-700">API</Link>
        <span>/</span>
        <span className="text-neutral-900">Projects</span>
      </nav>

      <h1>Projects API</h1>
      <p className="lead">
        Create, read, update, and delete projects programmatically.
      </p>

      <h2>List Projects</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`GET /v1/projects

// Response
{
  "data": [
    {
      "id": "proj_abc123",
      "name": "Mobile App",
      "type": "mobile",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "per_page": 20
  }
}`}</code>
      </pre>

      <h2>Get Project</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`GET /v1/projects/:id

// Response
{
  "id": "proj_abc123",
  "name": "Mobile App",
  "description": "iOS and Android app feedback",
  "type": "mobile",
  "settings": {
    "csat_threshold": 4.0,
    "response_goal": 1000
  },
  "stats": {
    "total_responses": 12543,
    "average_score": 4.2
  },
  "created_at": "2024-01-01T00:00:00Z"
}`}</code>
      </pre>

      <h2>Create Project</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`POST /v1/projects
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "type": "web"
}`}</code>
      </pre>

      <h2>Update Project</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`PATCH /v1/projects/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "settings": {
    "csat_threshold": 3.5
  }
}`}</code>
      </pre>

      <h2>Delete Project</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`DELETE /v1/projects/:id

// Response: 204 No Content`}</code>
      </pre>
    </div>
  );
}
