import { WidgetsClient } from './widgets-client';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function Page() {
  return <WidgetsClient />;
}
