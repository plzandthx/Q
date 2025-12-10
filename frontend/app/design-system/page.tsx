'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  Search,
  Mail,
  Eye,
  EyeOff,
  ChevronRight,
  Bell,
  Settings,
  User,
  Zap,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

// Import actual design tokens
import { colors, spacing, borderRadius, shadows } from '@/lib/design-tokens';

// Import actual UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge, PlanBadge, StatusBadge, RoleBadge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// ============================================================================
// Helper Components
// ============================================================================

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <Copy className="h-4 w-4 text-neutral-400" />
      )}
    </button>
  );
}

function ColorSwatch({
  name,
  value,
  textColor = 'text-neutral-900'
}: {
  name: string;
  value: string;
  textColor?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-lg border border-border shadow-sm flex-shrink-0"
        style={{ backgroundColor: value }}
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", textColor)}>{name}</p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-muted-foreground font-mono">{value}</code>
          <CopyButton text={value} />
        </div>
      </div>
    </div>
  );
}

function ColorScale({
  name,
  scale
}: {
  name: string;
  scale: Record<string | number, string>;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold capitalize">{name}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Object.entries(scale).map(([shade, value]) => (
          <ColorSwatch
            key={shade}
            name={shade}
            value={value}
            textColor={parseInt(shade) >= 500 || shade === 'DEFAULT' ? 'text-white' : 'text-neutral-900'}
          />
        ))}
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-h2 text-foreground">{title}</h2>
        {description && (
          <p className="mt-2 text-body text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-h4 text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function TokenTable({
  tokens
}: {
  tokens: { name: string; value: string; css?: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Token</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Value</th>
            {tokens[0]?.css && (
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">CSS Variable</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="py-3 px-4 font-mono text-primary">{token.name}</td>
              <td className="py-3 px-4 font-mono">{token.value}</td>
              {token.css && (
                <td className="py-3 px-4 font-mono text-muted-foreground">{token.css}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Navigation
// ============================================================================

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'shadows', label: 'Shadows' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Form Inputs' },
  { id: 'cards', label: 'Cards' },
  { id: 'badges', label: 'Badges' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'motion', label: 'Motion' },
  { id: 'utilities', label: 'Utilities' },
];

function SideNav() {
  const [activeSection, setActiveSection] = React.useState('overview');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hidden lg:block sticky top-24 h-fit">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block px-3 py-2 text-sm rounded-lg transition-colors',
                activeSection === item.id
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-neutral-100'
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function DesignSystemPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container-page py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="h-4 w-px bg-border" />
              <h1 className="text-xl font-semibold">Design System</h1>
              <Badge variant="primary" size="sm">v1.0</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-page py-12">
        <div className="flex gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-48 flex-shrink-0">
            <SideNav />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 space-y-16">
            {/* Overview */}
            <Section
              id="overview"
              title="Q Design System"
              description="A comprehensive design system powering the Q CSAT application. Built with Tailwind CSS, Radix UI, and Framer Motion."
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card padding="md">
                  <CardHeader>
                    <CardTitle as="h3">Tokens</CardTitle>
                    <CardDescription>
                      Design tokens for colors, typography, spacing, shadows, and more.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card padding="md">
                  <CardHeader>
                    <CardTitle as="h3">Components</CardTitle>
                    <CardDescription>
                      31 reusable UI components built with accessibility in mind.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card padding="md">
                  <CardHeader>
                    <CardTitle as="h3">Motion</CardTitle>
                    <CardDescription>
                      Purposeful animations with Framer Motion for polished interactions.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="mt-8">
                <Alert variant="info">
                  <AlertTitle>Figma Integration Coming Soon</AlertTitle>
                  <AlertDescription>
                    This design system will soon integrate with Figma MCP for real-time design updates and synchronization.
                  </AlertDescription>
                </Alert>
              </div>
            </Section>

            {/* Colors */}
            <Section
              id="colors"
              title="Colors"
              description="A confident but calm color palette designed for product analytics interfaces."
            >
              <div className="space-y-12">
                <SubSection title="Primary (Teal)">
                  <p className="text-sm text-muted-foreground mb-4">
                    Used for CTAs, primary actions, and brand identity.
                  </p>
                  <ColorScale name="primary" scale={colors.primary} />
                </SubSection>

                <SubSection title="Accent (Blue)">
                  <p className="text-sm text-muted-foreground mb-4">
                    Used for highlights, trends, and positive indicators.
                  </p>
                  <ColorScale name="accent" scale={colors.accent} />
                </SubSection>

                <SubSection title="Neutral (Gray)">
                  <p className="text-sm text-muted-foreground mb-4">
                    Used for text, backgrounds, and borders.
                  </p>
                  <ColorScale name="neutral" scale={colors.neutral} />
                </SubSection>

                <SubSection title="Semantic Colors">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <h5 className="text-sm font-medium text-success-600 mb-3">Success</h5>
                      <div className="space-y-2">
                        {Object.entries(colors.success).map(([shade, value]) => (
                          <ColorSwatch key={shade} name={shade} value={value} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-warning-600 mb-3">Warning</h5>
                      <div className="space-y-2">
                        {Object.entries(colors.warning).map(([shade, value]) => (
                          <ColorSwatch key={shade} name={shade} value={value} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-danger-600 mb-3">Danger</h5>
                      <div className="space-y-2">
                        {Object.entries(colors.danger).map(([shade, value]) => (
                          <ColorSwatch key={shade} name={shade} value={value} />
                        ))}
                      </div>
                    </div>
                  </div>
                </SubSection>

                <SubSection title="CSAT Score Colors">
                  <p className="text-sm text-muted-foreground mb-4">
                    Semantic colors for 1-5 CSAT ratings.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(colors.csat).map(([score, value]) => (
                      <div key={score} className="text-center">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
                          style={{ backgroundColor: value }}
                        >
                          {score}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-mono">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="csat-score-badge-1">1</span>
                    <span className="csat-score-badge-2">2</span>
                    <span className="csat-score-badge-3">3</span>
                    <span className="csat-score-badge-4">4</span>
                    <span className="csat-score-badge-5">5</span>
                  </div>
                </SubSection>
              </div>
            </Section>

            {/* Typography */}
            <Section
              id="typography"
              title="Typography"
              description="A clear typographic hierarchy using Inter for UI and JetBrains Mono for code."
            >
              <div className="space-y-12">
                <SubSection title="Font Families">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card padding="md">
                      <p className="text-sm text-muted-foreground mb-2">Sans (Inter)</p>
                      <p className="text-2xl font-sans">
                        The quick brown fox jumps over the lazy dog
                      </p>
                      <code className="text-xs text-muted-foreground mt-2 block font-mono">
                        font-family: Inter, system-ui, sans-serif
                      </code>
                    </Card>
                    <Card padding="md">
                      <p className="text-sm text-muted-foreground mb-2">Mono (JetBrains Mono)</p>
                      <p className="text-2xl font-mono">
                        The quick brown fox jumps over the lazy dog
                      </p>
                      <code className="text-xs text-muted-foreground mt-2 block font-mono">
                        font-family: JetBrains Mono, Consolas, monospace
                      </code>
                    </Card>
                  </div>
                </SubSection>

                <SubSection title="Type Scale">
                  <Card variant="flat" padding="md">
                    <div className="space-y-6">
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">5xl</span>
                        <span className="text-5xl font-bold">Display</span>
                        <span className="text-xs text-muted-foreground">3rem / 48px</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">4xl</span>
                        <span className="text-4xl font-bold tracking-tight">Heading 1</span>
                        <span className="text-xs text-muted-foreground">2.25rem / 36px</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">3xl</span>
                        <span className="text-3xl font-semibold tracking-tight">Heading 2</span>
                        <span className="text-xs text-muted-foreground">1.875rem / 30px</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">2xl</span>
                        <span className="text-2xl font-semibold">Heading 3</span>
                        <span className="text-xs text-muted-foreground">1.5rem / 24px</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">xl</span>
                        <span className="text-xl font-semibold">Heading 4</span>
                        <span className="text-xs text-muted-foreground">1.25rem / 20px</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">lg</span>
                        <span className="text-lg">Large Text</span>
                        <span className="text-xs text-muted-foreground">1.125rem / 18px</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">base</span>
                        <span className="text-base">Body Text</span>
                        <span className="text-xs text-muted-foreground">1rem / 16px</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">sm</span>
                        <span className="text-sm">Small Text</span>
                        <span className="text-xs text-muted-foreground">0.875rem / 14px</span>
                      </div>
                      <div className="flex items-baseline gap-4">
                        <span className="w-16 text-xs text-muted-foreground">xs</span>
                        <span className="text-xs">Caption</span>
                        <span className="text-xs text-muted-foreground">0.75rem / 12px</span>
                      </div>
                    </div>
                  </Card>
                </SubSection>

                <SubSection title="Font Weights">
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <span className="font-normal text-lg">Normal</span>
                      <p className="text-xs text-muted-foreground">400</p>
                    </div>
                    <div>
                      <span className="font-medium text-lg">Medium</span>
                      <p className="text-xs text-muted-foreground">500</p>
                    </div>
                    <div>
                      <span className="font-semibold text-lg">Semibold</span>
                      <p className="text-xs text-muted-foreground">600</p>
                    </div>
                    <div>
                      <span className="font-bold text-lg">Bold</span>
                      <p className="text-xs text-muted-foreground">700</p>
                    </div>
                  </div>
                </SubSection>

                <SubSection title="Text Utility Classes">
                  <Card variant="flat" padding="md">
                    <div className="space-y-4">
                      <div>
                        <p className="text-display">text-display</p>
                        <code className="text-xs text-muted-foreground">.text-display</code>
                      </div>
                      <div>
                        <p className="text-h1">text-h1</p>
                        <code className="text-xs text-muted-foreground">.text-h1</code>
                      </div>
                      <div>
                        <p className="text-h2">text-h2</p>
                        <code className="text-xs text-muted-foreground">.text-h2</code>
                      </div>
                      <div>
                        <p className="text-h3">text-h3</p>
                        <code className="text-xs text-muted-foreground">.text-h3</code>
                      </div>
                      <div>
                        <p className="text-h4">text-h4</p>
                        <code className="text-xs text-muted-foreground">.text-h4</code>
                      </div>
                      <div>
                        <p className="text-body">text-body - Regular body text for paragraphs and content.</p>
                        <code className="text-xs text-muted-foreground">.text-body</code>
                      </div>
                      <div>
                        <p className="text-body-sm">text-body-sm - Smaller body text.</p>
                        <code className="text-xs text-muted-foreground">.text-body-sm</code>
                      </div>
                      <div>
                        <p className="text-muted">text-muted - Secondary text with reduced emphasis.</p>
                        <code className="text-xs text-muted-foreground">.text-muted</code>
                      </div>
                      <div>
                        <p className="text-caption">text-caption - Small caption text.</p>
                        <code className="text-xs text-muted-foreground">.text-caption</code>
                      </div>
                    </div>
                  </Card>
                </SubSection>
              </div>
            </Section>

            {/* Spacing */}
            <Section
              id="spacing"
              title="Spacing"
              description="Consistent spacing scale based on a 4px grid system."
            >
              <div className="space-y-8">
                <SubSection title="Spacing Scale">
                  <div className="space-y-3">
                    {Object.entries(spacing).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4">
                        <span className="w-12 text-sm font-mono text-muted-foreground">{key}</span>
                        <div
                          className="h-6 bg-primary rounded"
                          style={{ width: value }}
                        />
                        <span className="text-sm text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Border Radius">
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(borderRadius).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div
                          className="w-16 h-16 bg-primary"
                          style={{ borderRadius: value }}
                        />
                        <p className="text-sm font-medium mt-2">{key}</p>
                        <p className="text-xs text-muted-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </SubSection>

                <SubSection title="Layout Tokens">
                  <TokenTable tokens={[
                    { name: 'sidebar', value: '16rem (256px)', css: '--spacing-sidebar' },
                    { name: 'sidebar-collapsed', value: '4rem (64px)', css: '--spacing-sidebar-collapsed' },
                    { name: 'topbar', value: '4rem (64px)', css: '--spacing-topbar' },
                  ]} />
                </SubSection>
              </div>
            </Section>

            {/* Shadows */}
            <Section
              id="shadows"
              title="Shadows"
              description="Subtle elevation system for depth and hierarchy."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(shadows).filter(([key]) => key !== 'none').map(([key, value]) => (
                  <Card
                    key={key}
                    variant="outline"
                    padding="md"
                    className="flex flex-col items-center justify-center h-32"
                    style={{ boxShadow: value }}
                  >
                    <p className="font-medium">{key}</p>
                    <code className="text-xs text-muted-foreground mt-2 text-center break-all">
                      shadow-{key}
                    </code>
                  </Card>
                ))}
              </div>
            </Section>

            {/* Buttons */}
            <Section
              id="buttons"
              title="Buttons"
              description="Flexible button component with multiple variants, sizes, and states."
            >
              <div className="space-y-8">
                <SubSection title="Variants">
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="danger-outline">Danger Outline</Button>
                    <Button variant="link">Link Style</Button>
                  </div>
                </SubSection>

                <SubSection title="Sizes">
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </SubSection>

                <SubSection title="Icon Buttons">
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="icon-sm" variant="ghost">
                      <Bell />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Settings />
                    </Button>
                    <Button size="icon-lg" variant="secondary">
                      <User />
                    </Button>
                  </div>
                </SubSection>

                <SubSection title="With Icons">
                  <div className="flex flex-wrap gap-4">
                    <Button leftIcon={<Zap className="h-4 w-4" />}>
                      With Left Icon
                    </Button>
                    <Button rightIcon={<ChevronRight className="h-4 w-4" />}>
                      With Right Icon
                    </Button>
                  </div>
                </SubSection>

                <SubSection title="States">
                  <div className="flex flex-wrap gap-4">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button fullWidth>Full Width</Button>
                  </div>
                </SubSection>
              </div>
            </Section>

            {/* Form Inputs */}
            <Section
              id="inputs"
              title="Form Inputs"
              description="Accessible form controls with consistent styling."
            >
              <div className="space-y-8">
                <SubSection title="Input">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <Input
                      label="Email"
                      placeholder="you@example.com"
                      leftElement={<Mail className="h-4 w-4" />}
                    />
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      rightElement={
                        <button onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                    <Input
                      label="Search"
                      placeholder="Search..."
                      leftElement={<Search className="h-4 w-4" />}
                      description="Press Enter to search"
                    />
                    <Input
                      label="With Error"
                      placeholder="Invalid input"
                      error="This field is required"
                      defaultValue="Invalid value"
                    />
                  </div>
                </SubSection>

                <SubSection title="Select">
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium mb-1.5">Select an option</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="grape">Grape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SubSection>

                <SubSection title="Checkbox">
                  <div className="space-y-4">
                    <Checkbox label="Accept terms and conditions" />
                    <Checkbox
                      label="Subscribe to newsletter"
                      description="Get updates about new features and improvements."
                    />
                    <Checkbox label="Disabled checkbox" disabled />
                    <Checkbox label="Checked disabled" disabled defaultChecked />
                  </div>
                </SubSection>

                <SubSection title="Switch">
                  <div className="space-y-4 max-w-md">
                    <Switch label="Enable notifications" />
                    <Switch
                      label="Dark mode"
                      description="Use dark theme across the application"
                    />
                    <Switch label="Disabled switch" disabled />
                  </div>
                </SubSection>
              </div>
            </Section>

            {/* Cards */}
            <Section
              id="cards"
              title="Cards"
              description="Flexible container component for grouping related content."
            >
              <div className="space-y-8">
                <SubSection title="Variants">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card variant="elevated" padding="md">
                      <CardHeader>
                        <CardTitle>Elevated Card</CardTitle>
                        <CardDescription>Default card with shadow and border.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Used for primary content containers.
                        </p>
                      </CardContent>
                    </Card>

                    <Card variant="flat" padding="md">
                      <CardHeader>
                        <CardTitle>Flat Card</CardTitle>
                        <CardDescription>Subtle background, no shadow.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Used for secondary content areas.
                        </p>
                      </CardContent>
                    </Card>

                    <Card variant="interactive" padding="md">
                      <CardHeader>
                        <CardTitle>Interactive Card</CardTitle>
                        <CardDescription>Hover effects for clickable cards.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Used for list items and navigation.
                        </p>
                      </CardContent>
                    </Card>

                    <Card variant="outline" padding="md">
                      <CardHeader>
                        <CardTitle>Outline Card</CardTitle>
                        <CardDescription>Transparent with border only.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Used for minimal emphasis containers.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </SubSection>

                <SubSection title="Padding Options">
                  <div className="flex flex-wrap gap-4">
                    <Card padding="sm" className="w-40">
                      <p className="text-sm">Small (p-4)</p>
                    </Card>
                    <Card padding="md" className="w-40">
                      <p className="text-sm">Medium (p-6)</p>
                    </Card>
                    <Card padding="lg" className="w-40">
                      <p className="text-sm">Large (p-8)</p>
                    </Card>
                  </div>
                </SubSection>

                <SubSection title="With Footer">
                  <Card padding="md" className="max-w-md">
                    <CardHeader>
                      <CardTitle>Card with Footer</CardTitle>
                      <CardDescription>Complete card with all sections.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This card demonstrates the full component structure including header, content, and footer.
                      </p>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button variant="outline" size="sm">Cancel</Button>
                      <Button size="sm">Save Changes</Button>
                    </CardFooter>
                  </Card>
                </SubSection>
              </div>
            </Section>

            {/* Badges */}
            <Section
              id="badges"
              title="Badges"
              description="Small labels for status, categories, and metadata."
            >
              <div className="space-y-8">
                <SubSection title="Variants">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="outline-primary">Outline Primary</Badge>
                  </div>
                </SubSection>

                <SubSection title="Solid Variants">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="solid-primary">Solid Primary</Badge>
                    <Badge variant="solid-success">Solid Success</Badge>
                    <Badge variant="solid-warning">Solid Warning</Badge>
                    <Badge variant="solid-danger">Solid Danger</Badge>
                  </div>
                </SubSection>

                <SubSection title="Sizes">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </SubSection>

                <SubSection title="With Icons">
                  <div className="flex flex-wrap gap-3">
                    <Badge leftIcon={<TrendingUp className="h-3 w-3" />} variant="success">
                      +12.5%
                    </Badge>
                    <Badge leftIcon={<TrendingDown className="h-3 w-3" />} variant="danger">
                      -5.2%
                    </Badge>
                  </div>
                </SubSection>

                <SubSection title="Preset Badges">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Plan Badges</p>
                      <div className="flex flex-wrap gap-3">
                        <PlanBadge plan="Free" />
                        <PlanBadge plan="Growth" />
                        <PlanBadge plan="Scale" />
                        <PlanBadge plan="Enterprise" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Status Badges</p>
                      <div className="flex flex-wrap gap-3">
                        <StatusBadge status="Active" />
                        <StatusBadge status="Pending" />
                        <StatusBadge status="Error" />
                        <StatusBadge status="Archived" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Role Badges</p>
                      <div className="flex flex-wrap gap-3">
                        <RoleBadge role="Owner" />
                        <RoleBadge role="Admin" />
                        <RoleBadge role="Member" />
                        <RoleBadge role="Viewer" />
                      </div>
                    </div>
                  </div>
                </SubSection>
              </div>
            </Section>

            {/* Alerts */}
            <Section
              id="alerts"
              title="Alerts"
              description="Contextual feedback messages for user actions and system states."
            >
              <div className="space-y-6 max-w-2xl">
                <Alert variant="default">
                  <AlertTitle>Default Alert</AlertTitle>
                  <AlertDescription>
                    This is a default alert for general information.
                  </AlertDescription>
                </Alert>

                <Alert variant="info">
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This is an informational alert with helpful context.
                  </AlertDescription>
                </Alert>

                <Alert variant="success">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your changes have been saved successfully.
                  </AlertDescription>
                </Alert>

                <Alert variant="warning">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Please review the changes before proceeding.
                  </AlertDescription>
                </Alert>

                <Alert variant="danger">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again.
                  </AlertDescription>
                </Alert>
              </div>
            </Section>

            {/* Tabs */}
            <Section
              id="tabs"
              title="Tabs"
              description="Organize content into separate views within a single context."
            >
              <div className="space-y-8">
                <SubSection title="Default Tabs">
                  <Tabs defaultValue="tab1">
                    <TabsList>
                      <TabsTrigger value="tab1">Overview</TabsTrigger>
                      <TabsTrigger value="tab2">Analytics</TabsTrigger>
                      <TabsTrigger value="tab3">Reports</TabsTrigger>
                      <TabsTrigger value="tab4" disabled>Disabled</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Overview content goes here.</p>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tab2">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Analytics content goes here.</p>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tab3">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Reports content goes here.</p>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </SubSection>

                <SubSection title="Pills Variant">
                  <Tabs defaultValue="tab1">
                    <TabsList variant="pills">
                      <TabsTrigger variant="pills" value="tab1">Overview</TabsTrigger>
                      <TabsTrigger variant="pills" value="tab2">Analytics</TabsTrigger>
                      <TabsTrigger variant="pills" value="tab3">Reports</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Pills style content.</p>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tab2">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Analytics content.</p>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tab3">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Reports content.</p>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </SubSection>

                <SubSection title="Underline Variant">
                  <Tabs defaultValue="tab1">
                    <TabsList variant="underline">
                      <TabsTrigger variant="underline" value="tab1">Overview</TabsTrigger>
                      <TabsTrigger variant="underline" value="tab2">Analytics</TabsTrigger>
                      <TabsTrigger variant="underline" value="tab3">Reports</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Underline style content.</p>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tab2">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Analytics content.</p>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tab3">
                      <Card padding="md">
                        <p className="text-sm text-muted-foreground">Reports content.</p>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </SubSection>
              </div>
            </Section>

            {/* Motion */}
            <Section
              id="motion"
              title="Motion"
              description="Purposeful animations for polished, professional interactions."
            >
              <div className="space-y-8">
                <SubSection title="Duration Tokens">
                  <TokenTable tokens={[
                    { name: 'fast', value: '150ms', css: 'duration.fast' },
                    { name: 'normal', value: '200ms', css: 'duration.normal' },
                    { name: 'slow', value: '250ms', css: 'duration.slow' },
                    { name: 'slower', value: '300ms', css: 'duration.slower' },
                  ]} />
                </SubSection>

                <SubSection title="Easing Curves">
                  <TokenTable tokens={[
                    { name: 'easeOut', value: '[0, 0, 0.2, 1]', css: 'Standard UI transitions' },
                    { name: 'easeIn', value: '[0.4, 0, 1, 1]', css: 'Elements entering' },
                    { name: 'easeInOut', value: '[0.4, 0, 0.2, 1]', css: 'Elements moving' },
                    { name: 'spring', value: '[0.68, -0.55, 0.265, 1.55]', css: 'Playful interactions' },
                  ]} />
                </SubSection>

                <SubSection title="Animation Variants">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card padding="sm">
                      <code className="text-sm font-mono text-primary">fadeVariants</code>
                      <p className="text-xs text-muted-foreground mt-1">Simple opacity fade in/out</p>
                    </Card>
                    <Card padding="sm">
                      <code className="text-sm font-mono text-primary">fadeScaleVariants</code>
                      <p className="text-xs text-muted-foreground mt-1">Fade with scale for dialogs</p>
                    </Card>
                    <Card padding="sm">
                      <code className="text-sm font-mono text-primary">slideUpVariants</code>
                      <p className="text-xs text-muted-foreground mt-1">Slide up for page content</p>
                    </Card>
                    <Card padding="sm">
                      <code className="text-sm font-mono text-primary">slideDownVariants</code>
                      <p className="text-xs text-muted-foreground mt-1">Slide down for dropdowns</p>
                    </Card>
                    <Card padding="sm">
                      <code className="text-sm font-mono text-primary">slideRightVariants</code>
                      <p className="text-xs text-muted-foreground mt-1">Slide from right for sidebars</p>
                    </Card>
                    <Card padding="sm">
                      <code className="text-sm font-mono text-primary">staggerContainerVariants</code>
                      <p className="text-xs text-muted-foreground mt-1">Staggered children animations</p>
                    </Card>
                    <Card padding="sm">
                      <code className="text-sm font-mono text-primary">pageVariants</code>
                      <p className="text-xs text-muted-foreground mt-1">Page transition animations</p>
                    </Card>
                    <Card padding="sm">
                      <code className="text-sm font-mono text-primary">toastVariants</code>
                      <p className="text-xs text-muted-foreground mt-1">Toast notification slide-in</p>
                    </Card>
                  </div>
                </SubSection>

                <SubSection title="Keyframe Animations">
                  <p className="text-sm text-muted-foreground mb-4">
                    CSS keyframe animations available via Tailwind classes.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge>animate-fade-in</Badge>
                    <Badge>animate-fade-out</Badge>
                    <Badge>animate-slide-in-right</Badge>
                    <Badge>animate-slide-out-right</Badge>
                    <Badge>animate-scale-in</Badge>
                    <Badge>animate-scale-out</Badge>
                    <Badge>animate-spin-slow</Badge>
                    <Badge>animate-pulse-subtle</Badge>
                  </div>
                </SubSection>
              </div>
            </Section>

            {/* Utilities */}
            <Section
              id="utilities"
              title="Utilities"
              description="Helper classes and functions for common patterns."
            >
              <div className="space-y-8">
                <SubSection title="Container Classes">
                  <TokenTable tokens={[
                    { name: '.container-page', value: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
                    { name: '.container-narrow', value: 'max-w-3xl mx-auto px-4 sm:px-6' },
                  ]} />
                </SubSection>

                <SubSection title="Card Utility Classes">
                  <TokenTable tokens={[
                    { name: '.card-elevated', value: 'bg-card rounded-xl shadow-card border' },
                    { name: '.card-elevated-hover', value: 'card-elevated with hover shadow' },
                    { name: '.card-flat', value: 'bg-muted rounded-xl border' },
                    { name: '.card-interactive', value: 'Clickable card with hover effects' },
                  ]} />
                </SubSection>

                <SubSection title="Gradient Backgrounds">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-primary h-24 rounded-lg flex items-center justify-center text-white font-medium">
                      .bg-gradient-primary
                    </div>
                    <div className="bg-gradient-accent h-24 rounded-lg flex items-center justify-center text-white font-medium">
                      .bg-gradient-accent
                    </div>
                    <div className="bg-gradient-hero h-24 rounded-lg flex items-center justify-center text-foreground font-medium border">
                      .bg-gradient-hero
                    </div>
                  </div>
                </SubSection>

                <SubSection title="Z-Index Scale">
                  <TokenTable tokens={[
                    { name: 'base', value: '0' },
                    { name: 'dropdown', value: '1000' },
                    { name: 'sticky', value: '1020' },
                    { name: 'fixed', value: '1030' },
                    { name: 'modalBackdrop', value: '1040' },
                    { name: 'modal', value: '1050' },
                    { name: 'popover', value: '1060' },
                    { name: 'tooltip', value: '1070' },
                    { name: 'toast', value: '1080' },
                  ]} />
                </SubSection>

                <SubSection title="Breakpoints">
                  <TokenTable tokens={[
                    { name: 'sm', value: '640px', css: '@media (min-width: 640px)' },
                    { name: 'md', value: '768px', css: '@media (min-width: 768px)' },
                    { name: 'lg', value: '1024px', css: '@media (min-width: 1024px)' },
                    { name: 'xl', value: '1280px', css: '@media (min-width: 1280px)' },
                    { name: '2xl', value: '1536px', css: '@media (min-width: 1536px)' },
                  ]} />
                </SubSection>

                <SubSection title="Utility Functions">
                  <Card variant="flat" padding="md">
                    <div className="space-y-4 font-mono text-sm">
                      <div>
                        <code className="text-primary">cn(...inputs)</code>
                        <p className="text-muted-foreground text-xs mt-1">Merge Tailwind classes intelligently</p>
                      </div>
                      <div>
                        <code className="text-primary">formatPercent(value, decimals?)</code>
                        <p className="text-muted-foreground text-xs mt-1">Format number as percentage</p>
                      </div>
                      <div>
                        <code className="text-primary">formatScore(score, decimals?)</code>
                        <p className="text-muted-foreground text-xs mt-1">Format CSAT score for display</p>
                      </div>
                      <div>
                        <code className="text-primary">getCsatScoreColor(score)</code>
                        <p className="text-muted-foreground text-xs mt-1">Get text color class for CSAT score</p>
                      </div>
                      <div>
                        <code className="text-primary">getCsatScoreBgColor(score)</code>
                        <p className="text-muted-foreground text-xs mt-1">Get background color class for CSAT score</p>
                      </div>
                      <div>
                        <code className="text-primary">formatDate(date, format?)</code>
                        <p className="text-muted-foreground text-xs mt-1">Format dates (short, long, relative)</p>
                      </div>
                      <div>
                        <code className="text-primary">formatCompact(value)</code>
                        <p className="text-muted-foreground text-xs mt-1">Format numbers with K/M suffix</p>
                      </div>
                      <div>
                        <code className="text-primary">truncate(text, maxLength)</code>
                        <p className="text-muted-foreground text-xs mt-1">Truncate text with ellipsis</p>
                      </div>
                      <div>
                        <code className="text-primary">getInitials(name, maxLength?)</code>
                        <p className="text-muted-foreground text-xs mt-1">Generate initials from name</p>
                      </div>
                      <div>
                        <code className="text-primary">debounce(fn, delay)</code>
                        <p className="text-muted-foreground text-xs mt-1">Debounce function calls</p>
                      </div>
                    </div>
                  </Card>
                </SubSection>
              </div>
            </Section>

            {/* Footer */}
            <div className="pt-12 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Q Design System v1.0
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Built with Tailwind CSS, Radix UI, and Framer Motion
                  </p>
                </div>
                <Link href="/">
                  <Button variant="outline" size="sm">
                    Back to App
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
