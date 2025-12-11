import Link from 'next/link';

export default function PersonasPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <span className="text-neutral-900">Personas</span>
      </nav>

      <h1>Customer Personas</h1>
      <p className="lead">
        Segment your customers to understand how satisfaction varies across
        different user groups.
      </p>

      <h2>What are Personas?</h2>
      <p>
        Personas allow you to segment your feedback by customer attributes like
        plan type, usage level, or custom properties. This helps you understand
        which customer segments are thriving and which need attention.
      </p>

      <h2>AI-Detected Personas</h2>
      <p>
        Q CSAT uses AI to automatically detect emerging customer segments based
        on feedback patterns. You might discover segments you didn&apos;t know existed,
        like &quot;Power Users&quot; or &quot;At-Risk Customers.&quot;
      </p>

      <h2>Creating Custom Personas</h2>
      <ol>
        <li>Go to your project&apos;s Personas tab</li>
        <li>Click &quot;Create Persona&quot;</li>
        <li>Define the filtering criteria</li>
        <li>Name your persona</li>
        <li>Save and start tracking</li>
      </ol>

      <h2>Common Persona Segments</h2>
      <ul>
        <li><strong>By Plan</strong> - Free, Pro, Enterprise</li>
        <li><strong>By Usage</strong> - Low, Medium, High activity</li>
        <li><strong>By Tenure</strong> - New, Established, Long-term</li>
        <li><strong>By Industry</strong> - SaaS, E-commerce, Healthcare</li>
      </ul>

      <h2>Using Personas</h2>
      <ul>
        <li>Compare CSAT scores across segments</li>
        <li>Identify at-risk customer groups</li>
        <li>Tailor follow-up actions by segment</li>
        <li>Track segment trends over time</li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li><Link href="/docs/integrations/overview">Connect your data sources</Link></li>
        <li><Link href="/docs/api/responses">Send customer properties via API</Link></li>
      </ul>
    </div>
  );
}
