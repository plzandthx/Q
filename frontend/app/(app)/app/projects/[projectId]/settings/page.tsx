import { SettingsClient } from './settings-client';

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

export default function Page() {
  return <SettingsClient />;
}
