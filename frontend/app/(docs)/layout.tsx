'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, Book, Code, Plug, Shield, FileText, Bell } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const docsNav = [
  {
    title: 'Getting Started',
    icon: Book,
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Quick Start', href: '/docs/getting-started/quick-start' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
    ],
  },
  {
    title: 'Projects & Moments',
    icon: FileText,
    items: [
      { title: 'Creating Projects', href: '/docs/projects/creating' },
      { title: 'Moments That Matter', href: '/docs/projects/moments' },
      { title: 'Personas', href: '/docs/projects/personas' },
    ],
  },
  {
    title: 'Widgets',
    icon: Code,
    items: [
      { title: 'Widget Overview', href: '/docs/widgets/overview' },
      { title: 'Embed Guide', href: '/docs/widgets/embed' },
      { title: 'Customization', href: '/docs/widgets/customization' },
    ],
  },
  {
    title: 'Integrations',
    icon: Plug,
    items: [
      { title: 'Overview', href: '/docs/integrations/overview' },
      { title: 'Zendesk', href: '/docs/integrations/zendesk' },
      { title: 'Slack', href: '/docs/integrations/slack' },
      { title: 'Webhooks', href: '/docs/integrations/webhooks' },
    ],
  },
  {
    title: 'API Reference',
    icon: Code,
    items: [
      { title: 'Authentication', href: '/docs/api/authentication' },
      { title: 'Projects', href: '/docs/api/projects' },
      { title: 'Responses', href: '/docs/api/responses' },
      { title: 'Webhooks', href: '/docs/api/webhooks' },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { title: 'Overview', href: '/docs/security/overview' },
      { title: 'Data Protection', href: '/docs/security/data-protection' },
      { title: 'Compliance', href: '/docs/security/compliance' },
    ],
  },
  {
    title: 'Release Notes',
    icon: Bell,
    items: [
      { title: 'Changelog', href: '/docs/changelog' },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-neutral-200 bg-white">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Logo variant="primary" size="md" showWordmark />
            </Link>
            <span className="text-neutral-300">|</span>
            <span className="font-medium text-neutral-600">Documentation</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search docs..."
                className="pl-9"
              />
            </div>
            <Link
              href="/app"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] border-r border-neutral-200 bg-white">
        <ScrollArea className="h-full py-6">
          <nav className="px-4 space-y-6">
            {docsNav.map((section) => (
              <div key={section.title}>
                <div className="flex items-center gap-2 mb-2">
                  <section.icon className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm font-semibold text-neutral-900">
                    {section.title}
                  </span>
                </div>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'block px-3 py-1.5 text-sm rounded-md transition-colors',
                          pathname === item.href
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 mt-16">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
