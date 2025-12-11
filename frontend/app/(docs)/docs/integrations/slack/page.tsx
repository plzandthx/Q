import Link from 'next/link';

export default function SlackIntegrationPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/integrations/overview" className="hover:text-neutral-700">Integrations</Link>
        <span>/</span>
        <span className="text-neutral-900">Slack</span>
      </nav>

      <h1>Slack Integration</h1>
      <p className="lead">
        Get real-time CSAT alerts and summaries in your Slack channels.
      </p>

      <h2>Setup Steps</h2>
      <ol>
        <li>Go to <Link href="/app/integrations">Integrations</Link></li>
        <li>Find Slack and click &quot;Connect&quot;</li>
        <li>Authorize the Q CSAT app in Slack</li>
        <li>Select the channel for notifications</li>
        <li>Configure notification preferences</li>
      </ol>

      <h2>Notification Types</h2>
      <ul>
        <li><strong>Low CSAT Alerts</strong> - Instant notification when scores drop</li>
        <li><strong>Daily Summary</strong> - End-of-day CSAT recap</li>
        <li><strong>Weekly Report</strong> - Weekly trends and insights</li>
        <li><strong>New Response</strong> - Every new survey response</li>
      </ul>

      <h2>Channel Configuration</h2>
      <p>You can send different notification types to different channels:</p>
      <ul>
        <li><code>#csat-alerts</code> - Critical alerts for immediate attention</li>
        <li><code>#csat-reports</code> - Daily and weekly summaries</li>
        <li><code>#team-feedback</code> - All responses for team visibility</li>
      </ul>

      <h2>Slash Commands</h2>
      <p>Once connected, use these commands in Slack:</p>
      <ul>
        <li><code>/qcsat status</code> - View current CSAT scores</li>
        <li><code>/qcsat report</code> - Generate an instant report</li>
      </ul>
    </div>
  );
}
