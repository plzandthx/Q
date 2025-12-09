import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Small status indicator badges.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'primary', 'danger', 'success', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

// Use Cases
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge className="bg-green-500">Active</Badge>
      <Badge className="bg-yellow-500">Pending</Badge>
      <Badge className="bg-red-500">Inactive</Badge>
      <Badge variant="outline">Draft</Badge>
      <Badge variant="secondary">New</Badge>
      <Badge>+12%</Badge>
    </div>
  ),
};

// With Status Colors
export const StatusColors: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge className="bg-green-100 text-green-700">Connected</Badge>
        <span className="text-sm text-neutral-600">Integration is active</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
        <span className="text-sm text-neutral-600">Awaiting approval</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge className="bg-red-100 text-red-700">Error</Badge>
        <span className="text-sm text-neutral-600">Action required</span>
      </div>
    </div>
  ),
};
