import { ProjectLayoutClient } from './project-layout-client';

// Required for static export - generate a placeholder path
export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectLayoutClient>{children}</ProjectLayoutClient>;
}
