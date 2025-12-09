import { Badge } from '@/components/ui/badge';

export default function TermsPage() {
  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
            Terms of Service
          </h1>
          <p className="mt-4 text-neutral-600">
            Last updated: March 1, 2024
          </p>
        </div>

        <div className="prose prose-neutral mt-12 max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Q CSAT&apos;s services, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do not
            agree with any of these terms, you are prohibited from using or accessing
            this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Q CSAT provides a customer satisfaction intelligence platform that enables
            businesses to collect, analyze, and act on customer feedback. Our services
            include survey widgets, analytics dashboards, integrations, and related
            features.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Service, you must register for an account.
            You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly notify us of any unauthorized access</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Upload malicious code or content</li>
          </ul>

          <h2>5. Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. You retain
            ownership of your data. By using the Service, you grant us a license to
            process your data as necessary to provide the Service.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned
            by Q CSAT and are protected by international copyright, trademark, and other
            intellectual property laws.
          </p>

          <h2>7. Payment Terms</h2>
          <p>
            Paid subscriptions are billed in advance on a monthly or annual basis.
            Fees are non-refundable except as required by law or as explicitly stated
            in these terms.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account at any time for violations of
            these terms. Upon termination, your right to use the Service will cease
            immediately.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind. We do not
            guarantee that the Service will be uninterrupted, secure, or error-free.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            Q CSAT shall not be liable for any indirect, incidental, special, or
            consequential damages arising from your use of the Service.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will provide
            notice of significant changes. Continued use of the Service constitutes
            acceptance of modified terms.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about these Terms should be sent to legal@qcsat.io.
          </p>
        </div>
      </div>
    </div>
  );
}
