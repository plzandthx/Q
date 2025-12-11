import Link from 'next/link';

export default function MomentsPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <span className="text-neutral-900">Moments That Matter</span>
      </nav>

      <h1>Moments That Matter</h1>
      <p className="lead">
        Identify and measure customer satisfaction at the most critical points
        in your customer journey.
      </p>

      <h2>What are Moments?</h2>
      <p>
        Moments are specific touchpoints in your customer journey where
        satisfaction matters most. By collecting feedback at these key moments,
        you get actionable insights that drive real improvements.
      </p>

      <h2>Common Moments to Track</h2>
      <ul>
        <li><strong>Post-purchase</strong> - Right after a customer completes a purchase</li>
        <li><strong>Onboarding completion</strong> - When a user finishes setup</li>
        <li><strong>Support resolution</strong> - After a support ticket is closed</li>
        <li><strong>Feature usage</strong> - After using a key feature</li>
        <li><strong>Renewal/Upgrade</strong> - Around subscription decisions</li>
      </ul>

      <h2>Setting Up Moments</h2>
      <ol>
        <li>Navigate to your project&apos;s Moments tab</li>
        <li>Click &quot;Create Moment&quot;</li>
        <li>Name your moment (e.g., &quot;Post-Checkout&quot;)</li>
        <li>Configure the trigger conditions</li>
        <li>Set the survey delay and frequency</li>
      </ol>

      <h2>Trigger Types</h2>
      <ul>
        <li><strong>Event-based</strong> - Trigger on specific user actions</li>
        <li><strong>Time-based</strong> - Trigger after a time delay</li>
        <li><strong>Page-based</strong> - Trigger on specific pages</li>
        <li><strong>API-triggered</strong> - Trigger via your backend</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>Don&apos;t survey too frequently - respect user attention</li>
        <li>Target moments with high emotional impact</li>
        <li>Use sampling for high-traffic moments</li>
        <li>A/B test different timing and triggers</li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li><Link href="/docs/projects/personas">Learn about Personas</Link></li>
        <li><Link href="/docs/widgets/customization">Customize your surveys</Link></li>
      </ul>
    </div>
  );
}
