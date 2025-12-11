import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function IntegrationsOverviewPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <span className="text-neutral-900">Integrations Overview</span>
      </nav>

      <h1>Integrations Overview</h1>
      <p className="lead">
        Connect Q CSAT with your existing tools to streamline your feedback workflow.
      </p>

      <h2>Available Integrations</h2>
      <div className="not-prose grid gap-4 sm:grid-cols-2 my-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="mt-2 text-sm text-neutral-600 space-y-1">
              <li>Zendesk</li>
              <li>Intercom</li>
              <li>Freshdesk</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Communication</h3>
            <ul className="mt-2 text-sm text-neutral-600 space-y-1">
              <li>Slack</li>
              <li>Microsoft Teams</li>
              <li>Email</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Analytics</h3>
            <ul className="mt-2 text-sm text-neutral-600 space-y-1">
              <li>Segment</li>
              <li>Mixpanel</li>
              <li>Amplitude</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">CRM</h3>
            <ul className="mt-2 text-sm text-neutral-600 space-y-1">
              <li>Salesforce</li>
              <li>HubSpot</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <h2>Connecting an Integration</h2>
      <ol>
        <li>Go to <Link href="/app/integrations">Integrations</Link> in your dashboard</li>
        <li>Find the integration you want to connect</li>
        <li>Click &quot;Connect&quot; and follow the authorization flow</li>
        <li>Configure the integration settings</li>
      </ol>

      <h2>Common Use Cases</h2>
      <ul>
        <li><strong>Support + Zendesk</strong> - Automatically survey after ticket closure</li>
        <li><strong>Alerts + Slack</strong> - Get notified of low CSAT scores</li>
        <li><strong>Data + Segment</strong> - Send CSAT data to your warehouse</li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li><Link href="/docs/integrations/zendesk">Set up Zendesk</Link></li>
        <li><Link href="/docs/integrations/slack">Set up Slack</Link></li>
        <li><Link href="/docs/integrations/webhooks">Configure webhooks</Link></li>
      </ul>
    </div>
  );
}
