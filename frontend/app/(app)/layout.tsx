'use client';

import { AppShell } from '@/components/layout/app-shell';

// Mock user data - TODO: Replace with actual auth context
const mockUser = {
  name: 'John Doe',
  email: 'john@company.com',
  avatarUrl: undefined,
};

const mockOrganizations = [
  { id: '1', name: 'Acme Inc', logoUrl: undefined },
  { id: '2', name: 'TechFlow', logoUrl: undefined },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      user={mockUser}
      organizations={mockOrganizations}
      currentOrganization={mockOrganizations[0]}
    >
      {children}
    </AppShell>
  );
}
