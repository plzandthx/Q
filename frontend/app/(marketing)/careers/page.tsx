'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Briefcase,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description:
      'Comprehensive health, dental, and vision insurance for you and your family.',
  },
  {
    icon: Clock,
    title: 'Flexible Work',
    description:
      'Remote-first culture with flexible hours. Work from anywhere.',
  },
  {
    icon: Sparkles,
    title: 'Learning Budget',
    description:
      '$2,000 annual budget for courses, conferences, and professional development.',
  },
  {
    icon: Users,
    title: 'Team Retreats',
    description:
      'Annual company retreats and regular team events to connect in person.',
  },
];

const openPositions = [
  {
    id: '1',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
  },
  {
    id: '2',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote (US/EU)',
    type: 'Full-time',
  },
  {
    id: '3',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote (US)',
    type: 'Full-time',
  },
  {
    id: '4',
    title: 'Data Scientist',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
  },
  {
    id: '5',
    title: 'Technical Writer',
    department: 'Product',
    location: 'Remote (US/EU)',
    type: 'Contract',
  },
];

const values = [
  {
    title: 'Customer Obsession',
    description:
      'We put customers at the center of everything we do. Their success is our success.',
  },
  {
    title: 'Ship Fast, Learn Faster',
    description:
      'We believe in rapid iteration and learning from real-world feedback.',
  },
  {
    title: 'Transparency',
    description:
      'We default to openness. Information flows freely, and decisions are made collaboratively.',
  },
  {
    title: 'Ownership',
    description:
      'We take pride in our work and take responsibility for outcomes, not just tasks.',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              We&apos;re hiring!
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Join us in shaping the future of{' '}
              <span className="text-primary-600">customer feedback</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-600">
              We&apos;re building tools that help companies understand and
              delight their customers. Join our remote-first team and make an
              impact.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <a href="#positions">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <motion.div
              variants={staggerItemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-neutral-900">
                Our Values
              </h2>
              <p className="mt-4 text-lg text-neutral-600">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <motion.div key={value.title} variants={staggerItemVariants}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-neutral-600">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <motion.div
              variants={staggerItemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-neutral-900">
                Benefits & Perks
              </h2>
              <p className="mt-4 text-lg text-neutral-600">
                We take care of our team so they can do their best work
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <motion.div key={benefit.title} variants={staggerItemVariants}>
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                        <Icon className="h-8 w-8 text-primary-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-neutral-600">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
          >
            <motion.div
              variants={staggerItemVariants}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-neutral-900">
                Open Positions
              </h2>
              <p className="mt-4 text-lg text-neutral-600">
                Find your next role and help us build something great
              </p>
            </motion.div>

            <div className="space-y-4 max-w-3xl mx-auto">
              {openPositions.map((position) => (
                <motion.div key={position.id} variants={staggerItemVariants}>
                  <Card className="hover:border-primary-300 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {position.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {position.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {position.location}
                            </span>
                            <Badge variant="outline">{position.type}</Badge>
                          </div>
                        </div>
                        <Button>
                          Apply
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={staggerItemVariants}
              className="mt-12 text-center"
            >
              <p className="text-neutral-600">
                Don&apos;t see a position that fits?{' '}
                <Link href="/contact" className="text-primary-600 hover:underline">
                  Reach out anyway
                </Link>
                . We&apos;re always looking for talented people.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white">
              Ready to make an impact?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join our team and help thousands of companies improve their
              customer experience.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <a href="#positions">
                  Browse Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
