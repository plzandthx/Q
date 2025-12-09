import Link from 'next/link';
import { FileText, Shield, Scale, Cookie } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const legalPages = [
  {
    title: 'Terms of Service',
    description: 'The agreement governing your use of Q CSAT services.',
    href: '/terms',
    icon: FileText,
    updated: 'March 1, 2024',
  },
  {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information.',
    href: '/privacy',
    icon: Shield,
    updated: 'March 1, 2024',
  },
  {
    title: 'Security',
    description: 'Our security practices, certifications, and compliance.',
    href: '/security',
    icon: Scale,
    updated: 'March 1, 2024',
  },
  {
    title: 'Cookie Policy',
    description: 'Information about cookies and similar technologies we use.',
    href: '/legal/cookies',
    icon: Cookie,
    updated: 'March 1, 2024',
  },
];

export default function LegalPage() {
  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
            Legal Information
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Important documents governing your use of Q CSAT.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {legalPages.map((page) => (
            <Link key={page.title} href={page.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                    <page.icon className="h-5 w-5 text-neutral-600" />
                  </div>
                  <h2 className="mt-4 font-semibold text-neutral-900">
                    {page.title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">{page.description}</p>
                  <p className="mt-3 text-xs text-neutral-400">
                    Last updated: {page.updated}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-lg bg-neutral-50 p-6 text-center">
          <p className="text-neutral-600">
            Have questions about our legal terms?{' '}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
