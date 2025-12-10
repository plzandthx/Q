import { AlertsClient } from './alerts-client';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function Page() {
  return <AlertsClient />;
}
