// Required for static export - generate a placeholder path
export function generateStaticParams() {
  return [{ integrationId: 'demo' }];
}

export default function IntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
