import Link from 'next/link';

export default function ZendeskIntegrationPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/integrations/overview" className="hover:text-neutral-700">Integrations</Link>
        <span>/</span>
        <span className="text-neutral-900">Zendesk</span>
      </nav>

      <h1>Zendesk Integration</h1>
      <p className="lead">
        Automatically survey customers when support tickets are resolved.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>A Zendesk account with admin access</li>
        <li>Q CSAT Pro plan or higher</li>
      </ul>

      <h2>Setup Steps</h2>
      <ol>
        <li>Go to <Link href="/app/integrations">Integrations</Link></li>
        <li>Find Zendesk and click &quot;Connect&quot;</li>
        <li>Enter your Zendesk subdomain</li>
        <li>Authorize the connection</li>
        <li>Configure trigger settings</li>
      </ol>

      <h2>Configuration Options</h2>
      <ul>
        <li><strong>Trigger Event</strong> - When to send surveys (ticket solved, closed, etc.)</li>
        <li><strong>Delay</strong> - Time to wait before sending (0-24 hours)</li>
        <li><strong>Sampling</strong> - Survey a percentage of tickets</li>
        <li><strong>Exclusions</strong> - Skip certain ticket types or tags</li>
      </ul>

      <h2>Data Sync</h2>
      <p>The integration syncs the following data:</p>
      <ul>
        <li>Ticket ID and subject</li>
        <li>Customer email and name</li>
        <li>Agent who handled the ticket</li>
        <li>Ticket tags and custom fields</li>
      </ul>

      <h2>Troubleshooting</h2>
      <ul>
        <li><strong>Surveys not sending?</strong> Check your trigger conditions and sampling rate</li>
        <li><strong>Missing data?</strong> Ensure the Zendesk API key has read permissions</li>
      </ul>
    </div>
  );
}
