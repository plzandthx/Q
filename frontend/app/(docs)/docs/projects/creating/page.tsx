import Link from 'next/link';

export default function CreatingProjectsPage() {
  return (
    <div className="prose prose-neutral max-w-none">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 not-prose">
        <Link href="/docs" className="hover:text-neutral-700">
          Docs
        </Link>
        <span>/</span>
        <span className="text-neutral-900">Creating Projects</span>
      </nav>

      <h1>Creating Projects</h1>
      <p className="lead">
        Projects are the foundation of Q CSAT. They represent different products,
        features, or customer touchpoints you want to measure.
      </p>

      <h2>What is a Project?</h2>
      <p>
        A project in Q CSAT represents a specific product, feature, or customer
        journey you want to track satisfaction for. For example:
      </p>
      <ul>
        <li>Your mobile app</li>
        <li>A specific feature like checkout or onboarding</li>
        <li>Customer support interactions</li>
        <li>Post-purchase experience</li>
      </ul>

      <h2>Creating Your First Project</h2>
      <ol>
        <li>
          Navigate to the <Link href="/app/projects">Projects page</Link>
        </li>
        <li>Click the &quot;New Project&quot; button</li>
        <li>Enter a name for your project (e.g., &quot;Mobile App&quot;)</li>
        <li>Add an optional description</li>
        <li>Select the project type that best matches your use case</li>
        <li>Click &quot;Create Project&quot;</li>
      </ol>

      <h2>Project Types</h2>
      <p>
        Choose the project type that best matches what you&apos;re measuring:
      </p>
      <ul>
        <li>
          <strong>Web Application</strong> - For websites and web-based SaaS
          products
        </li>
        <li>
          <strong>Mobile App</strong> - For iOS, Android, or cross-platform apps
        </li>
        <li>
          <strong>Customer Support</strong> - For support ticket satisfaction
        </li>
        <li>
          <strong>Other</strong> - For custom use cases or mixed channels
        </li>
      </ul>

      <h2>Project Settings</h2>
      <p>
        After creating a project, you can configure various settings:
      </p>
      <ul>
        <li>
          <strong>CSAT Threshold</strong> - Set the minimum acceptable score for
          alerts
        </li>
        <li>
          <strong>Response Goal</strong> - Set a target number of responses per
          month
        </li>
        <li>
          <strong>Team Access</strong> - Control who can view and edit the
          project
        </li>
        <li>
          <strong>Integrations</strong> - Connect third-party services
        </li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>
          Create separate projects for distinct customer journeys or products
        </li>
        <li>Use clear, descriptive names that your team will understand</li>
        <li>
          Set realistic CSAT thresholds based on industry benchmarks
        </li>
        <li>
          Review and update project settings as your product evolves
        </li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <Link href="/docs/projects/moments">
            Learn about Moments That Matter
          </Link>
        </li>
        <li>
          <Link href="/docs/widgets/overview">Set up feedback widgets</Link>
        </li>
        <li>
          <Link href="/docs/projects/personas">
            Configure customer personas
          </Link>
        </li>
      </ul>
    </div>
  );
}
