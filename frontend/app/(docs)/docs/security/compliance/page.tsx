import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CompliancePage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/security/overview" className="hover:text-neutral-700">Security</Link>
        <span>/</span>
        <span className="text-neutral-900">Compliance</span>
      </nav>

      <h1>Compliance</h1>
      <p className="lead">
        Our compliance certifications and regulatory adherence.
      </p>

      <div className="not-prose grid gap-4 sm:grid-cols-2 my-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">GDPR</h3>
              <Badge className="bg-green-500">Compliant</Badge>
            </div>
            <p className="text-sm text-neutral-600">
              Full compliance with the EU General Data Protection Regulation.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">CCPA</h3>
              <Badge className="bg-green-500">Compliant</Badge>
            </div>
            <p className="text-sm text-neutral-600">
              California Consumer Privacy Act compliance for US customers.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">SOC 2 Type II</h3>
              <Badge variant="secondary">In Progress</Badge>
            </div>
            <p className="text-sm text-neutral-600">
              Currently undergoing SOC 2 Type II audit, expected Q2 2024.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">HIPAA</h3>
              <Badge variant="outline">Enterprise</Badge>
            </div>
            <p className="text-sm text-neutral-600">
              HIPAA-compliant option available for healthcare customers.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2>GDPR Compliance</h2>
      <p>Our GDPR compliance measures include:</p>
      <ul>
        <li>Data Processing Agreement (DPA) available</li>
        <li>EU data residency option</li>
        <li>Right to access, rectification, and erasure</li>
        <li>Data portability support</li>
        <li>Privacy by design principles</li>
      </ul>

      <h2>CCPA Compliance</h2>
      <ul>
        <li>Do Not Sell My Personal Information support</li>
        <li>Right to know what data is collected</li>
        <li>Right to delete personal information</li>
        <li>Non-discrimination policy</li>
      </ul>

      <h2>Documentation</h2>
      <p>Available compliance documentation:</p>
      <ul>
        <li>Data Processing Agreement (DPA)</li>
        <li>Sub-processor List</li>
        <li>Security Whitepaper</li>
        <li>Penetration Test Summary (NDA required)</li>
      </ul>
      <p>
        Contact <a href="mailto:compliance@qcsat.io">compliance@qcsat.io</a> to
        request documentation.
      </p>
    </div>
  );
}
