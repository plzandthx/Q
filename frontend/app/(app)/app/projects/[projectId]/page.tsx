import { redirect } from 'next/navigation';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  // Redirect to the overview tab by default
  redirect(`/app/projects/${params.projectId}/overview`);
}
