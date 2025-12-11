// Required for static export - generate a placeholder path
export function generateStaticParams() {
  return [{ widgetId: 'demo' }];
}

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
