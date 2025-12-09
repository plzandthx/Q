'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Users,
  CreditCard,
  Shield,
  Key,
  Bell,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const settingsSections = [
  {
    title: 'Profile',
    description: 'Manage your personal information and preferences',
    href: '/app/settings/profile',
    icon: User,
  },
  {
    title: 'Account',
    description: 'Email, password, and account settings',
    href: '/app/settings/account',
    icon: User,
  },
  {
    title: 'Organization',
    description: 'Company details and branding',
    href: '/app/settings/organization',
    icon: Building2,
  },
  {
    title: 'Team Members',
    description: 'Invite and manage team access',
    href: '/app/settings/members',
    icon: Users,
  },
  {
    title: 'Billing',
    description: 'Subscription, invoices, and payment methods',
    href: '/app/settings/billing',
    icon: CreditCard,
  },
  {
    title: 'Security',
    description: 'Two-factor authentication and sessions',
    href: '/app/settings/security',
    icon: Shield,
  },
  {
    title: 'API Keys',
    description: 'Manage API keys for integrations',
    href: '/app/settings/api-keys',
    icon: Key,
  },
  {
    title: 'Notifications',
    description: 'Email and in-app notification preferences',
    href: '/app/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Danger Zone',
    description: 'Delete account and other destructive actions',
    href: '/app/settings/danger-zone',
    icon: AlertTriangle,
    danger: true,
  },
];

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your account and organization settings."
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {settingsSections.map((section) => (
          <motion.div key={section.title} variants={staggerItemVariants}>
            <Link href={section.href}>
              <Card
                className={`h-full hover:border-primary-300 transition-colors ${
                  section.danger ? 'border-red-200 hover:border-red-300' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          section.danger
                            ? 'bg-red-100'
                            : 'bg-neutral-100'
                        }`}
                      >
                        <section.icon
                          className={`h-5 w-5 ${
                            section.danger ? 'text-red-600' : 'text-neutral-600'
                          }`}
                        />
                      </div>
                      <div>
                        <h3
                          className={`font-semibold ${
                            section.danger
                              ? 'text-red-600'
                              : 'text-neutral-900'
                          }`}
                        >
                          {section.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </PageContainer>
  );
}
