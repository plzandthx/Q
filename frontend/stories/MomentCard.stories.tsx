import type { Meta, StoryObj } from '@storybook/react';
import { MomentCard } from '@/components/domain/moment-card';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

const meta: Meta<typeof MomentCard> = {
  title: 'Domain/MomentCard',
  component: MomentCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card for displaying "Moments That Matter" - critical customer touchpoints.',
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
    name: 'After Purchase',
    description: 'Survey shown after completing a purchase',
    trigger: 'event:purchase_complete',
    score: 4.8,
    responses: 2341,
    trend: 0.3,
    status: 'active',
  },
};

// Paused
export const Paused: Story = {
  args: {
    name: 'Checkout Flow',
    description: 'Survey during checkout process',
    trigger: 'page:/checkout',
    score: 4.1,
    responses: 892,
    trend: -0.1,
    status: 'paused',
  },
};

// Negative Trend
export const NegativeTrend: Story = {
  args: {
    name: 'Support Interaction',
    description: 'Survey after support ticket resolution',
    trigger: 'event:ticket_resolved',
    score: 3.9,
    responses: 3421,
    trend: -0.5,
    status: 'active',
  },
};

// With Actions
export const WithActions: Story = {
  args: {
    name: 'After Purchase',
    description: 'Survey shown after completing a purchase',
    trigger: 'event:purchase_complete',
    score: 4.8,
    responses: 2341,
    trend: 0.3,
    status: 'active',
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
      <MomentCard
        name="After Purchase"
        description="Survey shown after completing a purchase"
        trigger="event:purchase_complete"
        score={4.8}
        responses={2341}
        trend={0.3}
        status="active"
      />
      <MomentCard
        name="Onboarding Complete"
        description="Survey after user completes onboarding"
        trigger="event:onboarding_complete"
        score={4.6}
        responses={1856}
        trend={0.1}
        status="active"
      />
      <MomentCard
        name="Feature Discovery"
        description="Survey when user discovers a key feature"
        trigger="page:/features/*"
        score={4.2}
        responses={1234}
        trend={-0.2}
        status="active"
      />
      <MomentCard
        name="Checkout Flow"
        description="Survey during checkout process"
        trigger="page:/checkout"
        score={4.1}
        responses={892}
        trend={-0.1}
        status="paused"
      />
    </div>
  ),
};
