import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ApiAuthenticationPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <span className="text-neutral-900">API Authentication</span>
      </nav>

      <h1>API Authentication</h1>
      <p className="lead">
        Learn how to authenticate your requests to the Q CSAT API.
      </p>

      <h2>API Keys</h2>
      <p>
        All API requests require authentication using an API key. You can create
        and manage API keys in your{' '}
        <Link href="/app/settings/api-keys">API Keys settings</Link>.
      </p>

      <h2>Authentication Header</h2>
      <p>Include your API key in the Authorization header:</p>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`Authorization: Bearer qcsat_live_your_api_key`}</code>
      </pre>

      <h2>Example Request</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`curl -X GET "https://api.qcsat.io/v1/projects" \\
  -H "Authorization: Bearer qcsat_live_your_api_key" \\
  -H "Content-Type: application/json"`}</code>
      </pre>

      <h2>Key Types</h2>
      <Card className="not-prose my-6">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-neutral-50">
                <th className="px-4 py-3 text-left text-sm font-medium">Prefix</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Environment</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 text-sm font-mono">qcsat_live_</td>
                <td className="px-4 py-3 text-sm"><Badge>Production</Badge></td>
                <td className="px-4 py-3 text-sm">Live data, real surveys</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-mono">qcsat_test_</td>
                <td className="px-4 py-3 text-sm"><Badge variant="secondary">Test</Badge></td>
                <td className="px-4 py-3 text-sm">Development, no real data</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <h2>Rate Limits</h2>
      <ul>
        <li><strong>Standard:</strong> 100 requests per minute</li>
        <li><strong>Pro:</strong> 1,000 requests per minute</li>
        <li><strong>Enterprise:</strong> Custom limits</li>
      </ul>

      <h2>Error Responses</h2>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`// 401 Unauthorized
{
  "error": "unauthorized",
  "message": "Invalid or missing API key"
}

// 429 Rate Limited
{
  "error": "rate_limited",
  "message": "Too many requests",
  "retry_after": 60
}`}</code>
      </pre>

      <h2>Next Steps</h2>
      <ul>
        <li><Link href="/docs/api/projects">Projects API</Link></li>
        <li><Link href="/docs/api/responses">Responses API</Link></li>
        <li><Link href="/docs/api/webhooks">Webhooks API</Link></li>
      </ul>
    </div>
  );
}
