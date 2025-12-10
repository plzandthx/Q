import { MomentsClient } from './moments-client';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function Page() {
  return <MomentsClient />;
}
