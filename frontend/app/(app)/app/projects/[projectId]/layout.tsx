'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PageContainer, PageHeader } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

// TODO: Fetch project data
const projectData = {
  name: 'Mobile App',
  score: 4.5,
  status: 'active',
};

const tabs = [
  { label: 'Overview', href: 'overview' },
  { label: 'Moments', href: 'moments' },
  { label: 'Personas', href: 'personas' },
  { label: 'Widgets', href: 'widgets' },
  { label: 'Integrations', href: 'integrations' },
  { label: 'Recommendations', href: 'recommendations' },
  { label: 'Alerts', href: 'alerts' },
];

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId;

  return (
    <PageContainer>
      <PageHeader
        title={projectData.name}
        description={
          <div className="flex items-center gap-3">
            <Badge
              variant={projectData.status === 'active' ? 'success' : 'secondary'}
            >
              {projectData.status}
            </Badge>
            <span className="text-neutral-500">
              CSAT Score: <strong className="text-neutral-900">{projectData.score}</strong>
            </span>
          </div>
        }
        breadcrumbs={[
          { label: 'Projects', href: '/app/projects' },
          { label: projectData.name },
        ]}
      >
        <Button variant="outline" size="sm" asChild>
          <Link href={`/app/projects/${projectId}/settings`}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </PageHeader>

      {/* Tabs Navigation */}
      <div className="border-b border-neutral-200 mb-6 -mt-2">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const href = `/app/projects/${projectId}/${tab.href}`;
            const isActive = pathname === href;
            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </PageContainer>
  );
}
