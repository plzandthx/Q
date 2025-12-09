import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '@/components/domain/metric-card';
import { BarChart3, Users, MessageSquare, TrendingUp } from 'lucide-react';

const meta: Meta<typeof MetricCard> = {
  title: 'Domain/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Display key metrics with change indicators.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default
export const Default: Story = {
  args: {
    title: 'Overall CSAT',
    value: '4.2',
    change: 8,
    changeLabel: 'vs last month',
    icon: BarChart3,
  },
};

// Positive Change
export const PositiveChange: Story = {
  args: {
    title: 'Total Responses',
    value: '12,543',
    change: 23,
    changeLabel: 'vs last month',
    icon: MessageSquare,
  },
};

// Negative Change
export const NegativeChange: Story = {
  args: {
    title: 'Response Rate',
    value: '34%',
    change: -3,
    changeLabel: 'vs last month',
    icon: TrendingUp,
  },
};

// Grid Layout
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[600px]">
      <MetricCard
        title="Overall CSAT"
        value="4.2"
        change={8}
        changeLabel="vs last month"
        icon={BarChart3}
      />
      <MetricCard
        title="Total Responses"
        value="12,543"
        change={23}
        changeLabel="vs last month"
        icon={MessageSquare}
      />
      <MetricCard
        title="Active Users"
        value="8,234"
        change={15}
        changeLabel="vs last month"
        icon={Users}
      />
      <MetricCard
        title="Response Rate"
        value="34%"
        change={-3}
        changeLabel="vs last month"
        icon={TrendingUp}
      />
    </div>
  ),
};
