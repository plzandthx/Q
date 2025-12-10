import { PersonasClient } from './personas-client';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function Page() {
  return <PersonasClient />;
}
