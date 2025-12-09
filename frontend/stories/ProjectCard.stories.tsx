import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from '@/components/domain/project-card';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

const meta: Meta<typeof ProjectCard> = {
  title: 'Domain/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card for displaying CSAT projects with key metrics.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default Active
export const Active: Story = {
  args: {
    name: 'Mobile App',
    description: 'iOS and Android app feedback',
    score: 4.5,
    responses: 12543,
    responsesTrend: 23,
    moments: 8,
    status: 'active',
    href: '/app/projects/1/overview',
  },
};

// Inactive
export const Inactive: Story = {
  args: {
    name: 'Legacy Portal',
    description: 'Old customer portal (deprecated)',
    score: 3.2,
    responses: 432,
    responsesTrend: -12,
    moments: 3,
    status: 'inactive',
    href: '/app/projects/2/overview',
  },
};

// High Score
export const HighScore: Story = {
  args: {
    name: 'Onboarding',
    description: 'New user onboarding flow',
    score: 4.9,
    responses: 2134,
    responsesTrend: 42,
    moments: 6,
    status: 'active',
    href: '/app/projects/3/overview',
  },
};

// With Actions
export const WithActions: Story = {
  args: {
    name: 'Mobile App',
    description: 'iOS and Android app feedback',
    score: 4.5,
    responses: 12543,
    responsesTrend: 23,
    moments: 8,
    status: 'active',
    href: '/app/projects/1/overview',
    actions: (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreVertical className="h-4 w-4" />
      </Button>
    ),
  },
};

// Grid Layout
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[720px]">
      <ProjectCard
        name="Mobile App"
        description="iOS and Android app feedback"
        score={4.5}
        responses={12543}
        responsesTrend={23}
        moments={8}
        status="active"
        href="/app/projects/1/overview"
      />
      <ProjectCard
        name="Web Dashboard"
        description="SaaS dashboard experience"
        score={4.1}
        responses={8562}
        responsesTrend={15}
        moments={5}
        status="active"
        href="/app/projects/2/overview"
      />
      <ProjectCard
        name="Customer Support"
        description="Support ticket satisfaction"
        score={3.8}
        responses={23412}
        responsesTrend={-5}
        moments={12}
        status="active"
        href="/app/projects/3/overview"
      />
      <ProjectCard
        name="Legacy Portal"
        description="Old customer portal"
        score={3.2}
        responses={432}
        responsesTrend={-12}
        moments={3}
        status="inactive"
        href="/app/projects/4/overview"
      />
    </div>
  ),
};
