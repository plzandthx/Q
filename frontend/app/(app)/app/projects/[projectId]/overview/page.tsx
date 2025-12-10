import { ProjectOverviewClient } from './overview-client';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function Page() {
  return <ProjectOverviewClient />;
}
