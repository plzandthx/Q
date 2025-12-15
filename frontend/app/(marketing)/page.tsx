'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  MessageSquare,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  staggerContainerVariants,
  staggerItemVariants,
  fadeScaleVariants,
} from '@/lib/motion';

const features = [
  {
    icon: MessageSquare,
    title: 'Moments That Matter',
    description:
      'Track satisfaction at every critical touchpoint in the customer journey.',
  },
  {
    icon: Users,
    title: 'Persona Intelligence',
    description:
      'Understand how different customer segments experience your product.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Get instant insights with live dashboards and automated reporting.',
  },
  {
    icon: Zap,
    title: 'Smart Integrations',
    description:
      'Connect with Zendesk, Intercom, Slack, and 50+ other tools seamlessly.',
  },
  {
    icon: TrendingUp,
    title: 'Trend Detection',
    description:
      'AI-powered analysis identifies patterns before they become problems.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'SOC 2 compliant with encryption at rest and in transit.',
  },
];

const testimonials = [
  {
    quote:
      'Q CSAT transformed how we understand our customers. We reduced churn by 23% in the first quarter.',
    author: 'Sarah Chen',
    role: 'VP of Customer Success',
    company: 'TechFlow',
    rating: 5,
  },
  {
    quote:
      'The persona insights alone are worth it. We finally know which features matter most to each segment.',
    author: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'ScaleUp Inc',
    rating: 5,
  },
  {
    quote:
      'Setup took 15 minutes. The ROI was visible within the first week of deployment.',
    author: 'Emily Rodriguez',
    role: 'CEO',
    company: 'CloudBase',
    rating: 5,
  },
];

const stats = [
  { value: '10K+', label: 'Companies' },
  { value: '50M+', label: 'Responses Analyzed' },
  { value: '23%', label: 'Avg Churn Reduction' },
  { value: '4.9', label: 'Customer Rating' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants}
            className="text-center"
          >
            <motion.div variants={staggerItemVariants}>
              <Badge variant="secondary" className="mb-4">
                Now with AI-powered insights
              </Badge>
            </motion.div>

            <motion.h1
              variants={staggerItemVariants}
              className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
            >
              Customer satisfaction
              <br />
              <span className="text-primary-600">intelligence</span> that drives growth
            </motion.h1>

            <motion.p
              variants={staggerItemVariants}
              className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600"
            >
              Transform customer feedback into actionable insights. Q CSAT helps you
              understand what matters most to your customers at every touchpoint.
            </motion.p>

            <motion.div
              variants={staggerItemVariants}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/how-it-works">See how it works</Link>
              </Button>
            </motion.div>

            <motion.p
              variants={staggerItemVariants}
              className="mt-4 text-sm text-neutral-500"
            >
              No credit card required. Free 14-day trial.
            </motion.p>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 sm:mt-24"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-xl border border-neutral-200 bg-white p-2 shadow-2xl">
                <div className="rounded-lg bg-neutral-100 aspect-[16/9] flex items-center justify-center">
                  <div className="text-center text-neutral-400">
                    <BarChart3 className="mx-auto h-16 w-16 mb-4" />
                    <p className="text-sm">Dashboard Preview</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-primary-200 opacity-20 blur-3xl" />
              <div className="absolute -bottom-8 -right-8 h-72 w-72 rounded-full bg-accent-200 opacity-20 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-neutral-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItemVariants}
                className="text-center"
              >
                <p className="text-3xl font-bold text-neutral-900 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-neutral-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="text-center"
          >
            <motion.h2
              variants={staggerItemVariants}
              className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl"
            >
              Everything you need to understand your customers
            </motion.h2>
            <motion.p
              variants={staggerItemVariants}
              className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600"
            >
              From collection to action, Q CSAT provides the complete toolkit for
              customer satisfaction intelligence.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={staggerItemVariants}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <feature.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-neutral-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-neutral-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="text-center"
          >
            <motion.h2
              variants={staggerItemVariants}
              className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl"
            >
              Loved by customer-centric teams
            </motion.h2>
            <motion.p
              variants={staggerItemVariants}
              className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600"
            >
              See why thousands of companies trust Q CSAT to understand and improve
              customer satisfaction.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerVariants}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.author} variants={staggerItemVariants}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-neutral-700">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="mt-6">
                      <p className="font-semibold text-neutral-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeScaleVariants}
            className="relative rounded-3xl bg-primary-600 px-6 py-16 sm:px-12 sm:py-24"
          >
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to understand your customers better?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
                Join thousands of companies using Q CSAT to drive customer satisfaction
                and business growth.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-neutral-100 active:bg-neutral-200"
                  asChild
                >
                  <Link href="/auth/sign-up">
                    Start free trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                  asChild
                >
                  <Link href="/contact">Talk to sales</Link>
                </Button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-500 opacity-50" />
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary-700 opacity-50" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
