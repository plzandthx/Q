// Required for static export - generate a placeholder path
export function generateStaticParams() {
  return [{ slug: 'placeholder' }];
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
