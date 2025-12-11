import Link from 'next/link';

export default function WidgetsOverviewPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">Docs</Link>
        <span>/</span>
        <span className="text-neutral-900">Widget Overview</span>
      </nav>

      <h1>Widget Overview</h1>
      <p className="lead">
        Widgets are how you collect feedback from your customers. Learn about
        the different widget types and when to use each.
      </p>

      <h2>Widget Types</h2>

      <h3>Popup Modal</h3>
      <p>
        A centered modal overlay that captures attention. Best for important
        surveys that need high response rates.
      </p>

      <h3>Slide-in Panel</h3>
      <p>
        A non-intrusive panel that slides in from the corner. Good for
        continuous feedback collection without disrupting the user experience.
      </p>

      <h3>Inline Embed</h3>
      <p>
        Embedded directly in your page content. Perfect for post-action feedback
        or embedded in emails.
      </p>

      <h2>Rating Types</h2>
      <ul>
        <li><strong>5-Star Rating</strong> - Classic star rating (1-5)</li>
        <li><strong>Numeric Scale</strong> - Number scale (1-10)</li>
        <li><strong>Emoji Scale</strong> - Visual emoji feedback</li>
        <li><strong>Thumbs Up/Down</strong> - Simple binary feedback</li>
      </ul>

      <h2>Creating a Widget</h2>
      <ol>
        <li>Go to your project dashboard</li>
        <li>Navigate to the Widgets tab</li>
        <li>Click &quot;Create Widget&quot;</li>
        <li>Choose your widget type and rating style</li>
        <li>Customize the appearance</li>
        <li>Get your embed code</li>
      </ol>

      <h2>Next Steps</h2>
      <ul>
        <li><Link href="/docs/widgets/embed">Embed guide</Link></li>
        <li><Link href="/docs/widgets/customization">Customize appearance</Link></li>
        <li><Link href="/docs/getting-started/installation">Installation guide</Link></li>
      </ul>
    </div>
  );
}
