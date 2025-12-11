import Link from 'next/link';

export default function WidgetCustomizationPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <Link href="/docs/widgets/overview" className="hover:text-neutral-700">Widgets</Link>
        <span>/</span>
        <span className="text-neutral-900">Customization</span>
      </nav>

      <h1>Widget Customization</h1>
      <p className="lead">
        Make your widgets match your brand with custom colors, text, and styling.
      </p>

      <h2>Visual Customization</h2>
      <p>
        In the widget editor, you can customize:
      </p>
      <ul>
        <li><strong>Primary Color</strong> - Button and accent colors</li>
        <li><strong>Background Color</strong> - Widget background</li>
        <li><strong>Text Color</strong> - All text elements</li>
        <li><strong>Border Radius</strong> - Corner roundness</li>
        <li><strong>Font Family</strong> - Custom web fonts</li>
      </ul>

      <h2>Content Customization</h2>
      <ul>
        <li><strong>Question Text</strong> - The survey question</li>
        <li><strong>Thank You Message</strong> - Post-submission message</li>
        <li><strong>Button Labels</strong> - Submit, skip, etc.</li>
        <li><strong>Placeholder Text</strong> - For comment fields</li>
      </ul>

      <h2>CSS Customization</h2>
      <p>For advanced customization, inject custom CSS:</p>
      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto">
        <code>{`window.QCSAT.init({
  widgetId: 'w_abc123',
  customCSS: \`
    .qcsat-widget {
      font-family: 'Inter', sans-serif;
    }
    .qcsat-button {
      border-radius: 999px;
    }
  \`
});`}</code>
      </pre>

      <h2>Branding Options</h2>
      <ul>
        <li><strong>Logo</strong> - Add your company logo</li>
        <li><strong>Powered By</strong> - Show/hide Q CSAT branding</li>
        <li><strong>Custom Domain</strong> - Use your domain for surveys (Enterprise)</li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li><Link href="/docs/widgets/embed">Embed your widget</Link></li>
        <li><Link href="/docs/projects/moments">Set up triggers</Link></li>
      </ul>
    </div>
  );
}
