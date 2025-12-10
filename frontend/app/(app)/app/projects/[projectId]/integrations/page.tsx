import { IntegrationsClient } from './integrations-client';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function Page() {
  return <IntegrationsClient />;
}
