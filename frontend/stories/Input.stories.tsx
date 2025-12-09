import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';
import { Search, Mail, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Text input field with support for various types and states.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Email</label>
      <Input type="email" placeholder="you@example.com" />
    </div>
  ),
};

// With Icon
export const WithIcon: Story = {
  render: () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      <Input placeholder="Search..." className="pl-9" />
    </div>
  ),
};

// Password Input
export const Password: Story = {
  render: function PasswordInput() {
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        <Input type={show ? 'text' : 'password'} placeholder="••••••••" />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

// With Error
export const WithError: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Email</label>
      <Input
        type="email"
        placeholder="you@example.com"
        className="border-red-500 focus-visible:ring-red-500"
        defaultValue="invalid-email"
      />
      <p className="text-sm text-red-500">Please enter a valid email address</p>
    </div>
  ),
};

// Types
export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="search" placeholder="Search" />
      <Input type="url" placeholder="URL" />
    </div>
  ),
};
