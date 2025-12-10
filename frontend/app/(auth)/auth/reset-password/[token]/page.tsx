import ResetPasswordClient from './reset-password-client';

export function generateStaticParams() {
  return [{ token: 'placeholder' }];
}

export default function Page() {
  return <ResetPasswordClient />;
}
