import Link from 'next/link';

export default function SecurityOverviewPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <span className="text-neutral-900">Security Overview</span>
      </nav>

      <h1>Security Overview</h1>
      <p className="lead">
        Learn about Q CSAT&apos;s security practices and how we protect your data.
      </p>

      <h2>Our Commitment</h2>
      <p>
        Security is a top priority at Q CSAT. We implement industry-standard
        security measures to protect your data and your customers&apos; information.
      </p>

      <h2>Infrastructure Security</h2>
      <ul>
        <li><strong>Cloud Provider:</strong> Hosted on AWS with SOC 2 compliance</li>
        <li><strong>Encryption:</strong> All data encrypted at rest and in transit</li>
        <li><strong>Network:</strong> VPC isolation, WAF, and DDoS protection</li>
        <li><strong>Monitoring:</strong> 24/7 monitoring and alerting</li>
      </ul>

      <h2>Application Security</h2>
      <ul>
        <li><strong>Authentication:</strong> Secure password hashing, MFA support</li>
        <li><strong>Authorization:</strong> Role-based access control (RBAC)</li>
        <li><strong>API Security:</strong> Rate limiting, API key rotation</li>
        <li><strong>Auditing:</strong> Comprehensive audit logs</li>
      </ul>

      <h2>Data Protection</h2>
      <ul>
        <li><strong>Encryption:</strong> AES-256 encryption at rest</li>
        <li><strong>Backup:</strong> Daily encrypted backups with 30-day retention</li>
        <li><strong>Isolation:</strong> Customer data is logically isolated</li>
        <li><strong>Deletion:</strong> Data permanently deleted upon request</li>
      </ul>

      <h2>Compliance</h2>
      <ul>
        <li><strong>GDPR:</strong> Full compliance with EU data protection</li>
        <li><strong>CCPA:</strong> California Consumer Privacy Act compliance</li>
        <li><strong>SOC 2:</strong> Type II certification (in progress)</li>
      </ul>

      <h2>Reporting Security Issues</h2>
      <p>
        If you discover a security vulnerability, please email{' '}
        <a href="mailto:security@qcsat.io">security@qcsat.io</a>. We appreciate
        responsible disclosure and will respond within 24 hours.
      </p>

      <h2>Learn More</h2>
      <ul>
        <li><Link href="/docs/security/data-protection">Data Protection</Link></li>
        <li><Link href="/docs/security/compliance">Compliance Details</Link></li>
        <li><Link href="/security">Security Page</Link></li>
      </ul>
    </div>
  );
}
