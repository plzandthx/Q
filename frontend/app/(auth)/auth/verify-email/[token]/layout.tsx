// Required for static export - generate a placeholder path
export function generateStaticParams() {
  return [{ token: 'placeholder' }];
}

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
