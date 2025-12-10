import VerifyEmailClient from './verify-email-client';

export function generateStaticParams() {
  return [{ token: 'placeholder' }];
}

export default function Page() {
  return <VerifyEmailClient />;
}
