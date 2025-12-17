import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Q CSAT - Customer Satisfaction Intelligence',
    template: '%s | Q CSAT',
  },
  description:
    'Transform customer feedback into actionable insights. Q CSAT helps you understand what matters most to your customers at every touchpoint.',
  keywords: [
    'CSAT',
    'customer satisfaction',
    'feedback analytics',
    'customer experience',
    'NPS',
    'survey analytics',
  ],
  authors: [{ name: 'Q CSAT' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://qcsat.io',
    siteName: 'Q CSAT',
    title: 'Q CSAT - Customer Satisfaction Intelligence',
    description:
      'Transform customer feedback into actionable insights.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Q CSAT - Customer Satisfaction Intelligence',
    description:
      'Transform customer feedback into actionable insights.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Adobe Fonts - Degular */}
        <link rel="stylesheet" href="https://use.typekit.net/lff2mnr.css" />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
