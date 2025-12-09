import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card container with header, content, and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with some text.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

// With Form
export const WithForm: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>Set up a new CSAT project.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input placeholder="Project name" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input placeholder="Optional description" className="mt-1" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  ),
};

// Metric Card Style
export const MetricStyle: Story = {
  render: () => (
    <Card className="w-[250px]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">Overall CSAT</p>
          <Badge>+8%</Badge>
        </div>
        <p className="mt-2 text-3xl font-bold">4.2</p>
        <p className="text-xs text-neutral-400 mt-1">vs last month</p>
      </CardContent>
    </Card>
  ),
};

// Interactive
export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px] cursor-pointer hover:border-primary-300 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <span className="text-lg font-bold text-primary-600">P</span>
          </div>
          <div>
            <h3 className="font-semibold">Mobile App</h3>
            <p className="text-sm text-neutral-500">12,543 responses</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
