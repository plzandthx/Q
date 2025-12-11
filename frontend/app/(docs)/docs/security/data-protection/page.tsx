import Link from 'next/link';

export default function DataProtectionPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/security/overview" className="hover:text-neutral-700">Security</Link>
        <span>/</span>
        <span className="text-neutral-900">Data Protection</span>
      </nav>

      <h1>Data Protection</h1>
      <p className="lead">
        How we protect and handle your data throughout its lifecycle.
      </p>

      <h2>Data Encryption</h2>
      <h3>In Transit</h3>
      <ul>
        <li>TLS 1.3 for all API and web traffic</li>
        <li>HSTS enforced with minimum 1-year max-age</li>
        <li>Certificate transparency monitoring</li>
      </ul>

      <h3>At Rest</h3>
      <ul>
        <li>AES-256 encryption for all stored data</li>
        <li>AWS KMS for key management</li>
        <li>Separate encryption keys per customer (Enterprise)</li>
      </ul>

      <h2>Data Retention</h2>
      <ul>
        <li><strong>Survey Responses:</strong> Retained for the life of your account</li>
        <li><strong>Audit Logs:</strong> 90 days (1 year for Enterprise)</li>
        <li><strong>Backups:</strong> 30 days retention</li>
        <li><strong>Deleted Data:</strong> Purged within 30 days</li>
      </ul>

      <h2>Data Access</h2>
      <ul>
        <li>Principle of least privilege for all employees</li>
        <li>No customer data access without explicit authorization</li>
        <li>All access logged and audited</li>
        <li>Background checks for employees with data access</li>
      </ul>

      <h2>Data Deletion</h2>
      <p>You can request data deletion at any time:</p>
      <ol>
        <li>Go to Settings &gt; Danger Zone</li>
        <li>Click &quot;Export Data&quot; to download your data</li>
        <li>Click &quot;Delete Account&quot; to remove all data</li>
      </ol>
      <p>
        Alternatively, contact{' '}
        <a href="mailto:privacy@qcsat.io">privacy@qcsat.io</a> for assistance.
      </p>

      <h2>Data Processing</h2>
      <ul>
        <li><strong>Location:</strong> Data processed in US-East and EU-West regions</li>
        <li><strong>Sub-processors:</strong> AWS, Stripe, SendGrid</li>
        <li><strong>DPA:</strong> Data Processing Agreement available upon request</li>
      </ul>
    </div>
  );
}
