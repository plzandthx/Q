import { ProjectLayoutClient } from './project-layout-client';

// Required for static export - generate paths for all mock projects
// These IDs match the mock data in the projects list page
export function generateStaticParams() {
  return [
    { projectId: '1' },
    { projectId: '2' },
    { projectId: '3' },
    { projectId: '4' },
    { projectId: '5' },
    { projectId: '6' },
    { projectId: 'demo' },
  ];
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectLayoutClient>{children}</ProjectLayoutClient>;
}
