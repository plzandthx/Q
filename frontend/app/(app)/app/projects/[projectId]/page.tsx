import { redirect } from 'next/navigation';

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

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  // Redirect to the overview tab by default
  redirect(`/app/projects/${params.projectId}/overview`);
}
