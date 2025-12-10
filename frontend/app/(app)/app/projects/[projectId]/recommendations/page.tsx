import { RecommendationsClient } from './recommendations-client';

export function generateStaticParams() {
  return [{ projectId: 'demo' }];
}

export default function Page() {
  return <RecommendationsClient />;
}
