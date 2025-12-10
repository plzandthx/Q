import { SettingsClient } from './settings-client';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function Page() {
  return <SettingsClient />;
}
