// Required for static export - generates no paths at build time
// Pages are rendered client-side when navigated to
export function generateStaticParams() {
  return [];
}

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
