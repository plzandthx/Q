'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Target, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const values = [
  {
    icon: Heart,
    title: 'Customer Obsession',
    description:
      'Every decision we make starts with the customer. We build tools that help our customers serve their customers better.',
  },
  {
    icon: Target,
    title: 'Actionable Insights',
    description:
      'Data without action is just noise. We focus on insights that drive real improvements in customer satisfaction.',
  },
  {
    icon: Zap,
    title: 'Speed & Simplicity',
    description:
      'Enterprise power with startup simplicity. Set up in minutes, see value in hours, transform your business in weeks.',
  },
  {
    icon: Users,
    title: 'Team First',
    description:
      'Great products come from great teams. We invest in our people and foster a culture of collaboration and growth.',
  },
];

const team = [
  {
    name: 'Alex Rivera',
    role: 'CEO & Co-Founder',
    bio: 'Former VP of Product at Zendesk. Passionate about customer experience.',
  },
  {
    name: 'Jordan Lee',
    role: 'CTO & Co-Founder',
    bio: 'Previously led engineering at Intercom. Built systems serving millions.',
  },
  {
    name: 'Sam Patel',
    role: 'Head of Customer Success',
    bio: '10+ years in customer success. Believer in the power of feedback.',
  },
  {
    name: 'Morgan Chen',
    role: 'Head of Product',
    bio: 'Product leader with experience at Stripe and Square.',
  },
];

const milestones = [
  { year: '2020', title: 'Founded', description: 'Q CSAT was born in San Francisco' },
  { year: '2021', title: 'Seed Round', description: '$5M raised from top VCs' },
  { year: '2022', title: '1K Customers', description: 'Milestone customer count reached' },
  { year: '2023', title: 'Series A', description: '$25M raised to accelerate growth' },
  { year: '2024', title: '10K Customers', description: 'Serving companies worldwide' },
];

export default function AboutPage() {
  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="text-center"
        >
          <motion.div variants={staggerItemVariants}>
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
          </motion.div>
          <motion.h1
            variants={staggerItemVariants}
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
          >
            We&apos;re on a mission to help
            <br />
            companies listen better
          </motion.h1>
          <motion.p
            variants={staggerItemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600"
          >
            Q CSAT was founded on a simple belief: every company can improve when
            they truly understand their customers. We build the tools to make that
            possible.
          </motion.p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-24"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div variants={staggerItemVariants}>
              <h2 className="text-3xl font-bold text-neutral-900">Our Story</h2>
              <div className="mt-6 space-y-4 text-neutral-600">
                <p>
                  Q CSAT started when our founders noticed a gap in the market:
                  companies were drowning in customer feedback but struggling to
                  turn it into action. Traditional survey tools gave you data, but
                  not insights.
                </p>
                <p>
                  We set out to build something different—a platform that not only
                  collects feedback but automatically surfaces the insights that
                  matter most. One that understands that different customers have
                  different needs, and that the &quot;moments that matter&quot; are where
                  satisfaction is won or lost.
                </p>
                <p>
                  Today, Q CSAT powers customer satisfaction for thousands of
                  companies, from early-stage startups to Fortune 500 enterprises.
                  We&apos;re proud of what we&apos;ve built, but we&apos;re even more excited about
                  what&apos;s ahead.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={staggerItemVariants}
              className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50"
            />
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-32"
        >
          <motion.div variants={staggerItemVariants} className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Our Values</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              These principles guide everything we do, from product decisions to
              hiring to customer support.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            className="mt-12 grid gap-8 sm:grid-cols-2"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={staggerItemVariants}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <value.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-neutral-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-32"
        >
          <motion.div variants={staggerItemVariants} className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Our Journey</h2>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            className="mt-12 relative"
          >
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  variants={staggerItemVariants}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 md:text-right">
                    {index % 2 === 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm font-semibold text-primary-600">
                            {milestone.year}
                          </p>
                          <p className="font-semibold text-neutral-900">
                            {milestone.title}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <div className="relative z-10 hidden h-4 w-4 rounded-full bg-primary-500 md:block" />
                  <div className="flex-1">
                    {index % 2 !== 0 && (
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-sm font-semibold text-primary-600">
                            {milestone.year}
                          </p>
                          <p className="font-semibold text-neutral-900">
                            {milestone.title}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-32"
        >
          <motion.div variants={staggerItemVariants} className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Leadership Team</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Meet the people building the future of customer feedback.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {team.map((member) => (
              <motion.div key={member.name} variants={staggerItemVariants}>
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-50" />
                    <h3 className="mt-4 font-semibold text-neutral-900">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary-600">{member.role}</p>
                    <p className="mt-2 text-sm text-neutral-600">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerItemVariants}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl font-bold text-neutral-900">Join our team</h2>
          <p className="mt-4 text-lg text-neutral-600">
            We&apos;re always looking for talented people who care about customer
            experience.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/careers">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
