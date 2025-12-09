import { Badge } from '@/components/ui/badge';

export default function PrivacyPage() {
  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
            Privacy Policy
          </h1>
          <p className="mt-4 text-neutral-600">
            Last updated: March 1, 2024
          </p>
        </div>

        <div className="prose prose-neutral mt-12 max-w-none">
          <h2>Introduction</h2>
          <p>
            Q CSAT (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our customer satisfaction platform.
          </p>

          <h2>Information We Collect</h2>

          <h3>Information You Provide</h3>
          <ul>
            <li>Account information (name, email, company)</li>
            <li>Payment information (processed by our payment provider)</li>
            <li>Survey configurations and settings</li>
            <li>Customer feedback data you collect through our platform</li>
            <li>Communications with our support team</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li>Device and browser information</li>
            <li>IP address and location data</li>
            <li>Usage data and analytics</li>
            <li>Cookies and similar technologies</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our Service</li>
            <li>Process transactions and send related information</li>
            <li>Send administrative notifications</li>
            <li>Respond to inquiries and provide support</li>
            <li>Analyze usage to improve our Service</li>
            <li>Detect and prevent fraud and abuse</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Data Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers who assist in our operations</li>
            <li>Business partners with your consent</li>
            <li>Legal authorities when required by law</li>
            <li>Acquirers in the event of a business transaction</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2>Data Security</h2>
          <p>
            We implement industry-standard security measures including:
          </p>
          <ul>
            <li>Encryption in transit (TLS) and at rest (AES-256)</li>
            <li>Regular security audits and penetration testing</li>
            <li>Access controls and authentication</li>
            <li>Secure data centers with SOC 2 certification</li>
          </ul>

          <h2>Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as
            needed to provide services. You may request deletion of your data at any
            time, subject to legal retention requirements.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
            <li>Restrict processing of your data</li>
          </ul>

          <h2>International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other
            than your own. We ensure appropriate safeguards are in place for such
            transfers.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our Service is not intended for children under 16. We do not knowingly
            collect information from children under 16.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you
            of significant changes via email or through our Service.
          </p>

          <h2>Contact Us</h2>
          <p>
            For privacy-related questions or to exercise your rights, contact us at:
          </p>
          <ul>
            <li>Email: privacy@qcsat.io</li>
            <li>Address: 123 Market Street, Suite 456, San Francisco, CA 94105</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
