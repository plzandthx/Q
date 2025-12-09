'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API data
const featuredPost = {
  slug: 'future-of-customer-feedback',
  title: 'The Future of Customer Feedback: AI-Powered CSAT Analysis',
  excerpt:
    'Discover how artificial intelligence is transforming the way companies understand and act on customer satisfaction data.',
  category: 'Insights',
  author: { name: 'Sarah Chen', avatar: null },
  date: '2024-03-15',
  readTime: '8 min read',
  image: null,
};

const posts = [
  {
    slug: 'moments-that-matter-guide',
    title: 'The Complete Guide to Moments That Matter',
    excerpt:
      'Learn how to identify and measure the touchpoints that have the biggest impact on customer satisfaction.',
    category: 'Best Practices',
    author: { name: 'Marcus Johnson', avatar: null },
    date: '2024-03-10',
    readTime: '6 min read',
  },
  {
    slug: 'persona-segmentation-csat',
    title: 'Why Persona-Based CSAT Segmentation Changes Everything',
    excerpt:
      'Not all customers are the same. Here is why measuring CSAT by persona reveals hidden insights.',
    category: 'Strategy',
    author: { name: 'Emily Rodriguez', avatar: null },
    date: '2024-03-05',
    readTime: '5 min read',
  },
  {
    slug: 'zendesk-integration-setup',
    title: 'How to Set Up Q CSAT with Zendesk in 10 Minutes',
    excerpt:
      'A step-by-step guide to connecting Q CSAT with your Zendesk instance for seamless feedback collection.',
    category: 'Tutorials',
    author: { name: 'David Park', avatar: null },
    date: '2024-02-28',
    readTime: '4 min read',
  },
  {
    slug: 'reducing-churn-csat',
    title: 'How TechFlow Reduced Churn by 23% with CSAT Insights',
    excerpt:
      'A case study on how one SaaS company used Q CSAT to identify and fix customer pain points.',
    category: 'Case Studies',
    author: { name: 'Sarah Chen', avatar: null },
    date: '2024-02-20',
    readTime: '7 min read',
  },
  {
    slug: 'survey-fatigue-prevention',
    title: 'Avoiding Survey Fatigue: The Art of Timing',
    excerpt:
      'Learn the optimal frequency and timing for customer surveys to maximize response rates.',
    category: 'Best Practices',
    author: { name: 'Marcus Johnson', avatar: null },
    date: '2024-02-15',
    readTime: '5 min read',
  },
  {
    slug: 'csat-vs-nps',
    title: 'CSAT vs NPS: Which Metric Should You Use?',
    excerpt:
      'A comprehensive comparison of customer satisfaction metrics and when to use each one.',
    category: 'Strategy',
    author: { name: 'Emily Rodriguez', avatar: null },
    date: '2024-02-10',
    readTime: '6 min read',
  },
];

const categories = ['All', 'Insights', 'Best Practices', 'Strategy', 'Tutorials', 'Case Studies'];

export default function BlogPage() {
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
              Blog
            </Badge>
          </motion.div>
          <motion.h1
            variants={staggerItemVariants}
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
          >
            Insights & Resources
          </motion.h1>
          <motion.p
            variants={staggerItemVariants}
            className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600"
          >
            Expert guides, best practices, and the latest thinking on customer
            satisfaction measurement.
          </motion.p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerItemVariants}
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === 'All'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerItemVariants}
          className="mt-16"
        >
          <Link href={`/blog/${featuredPost.slug}`}>
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="grid md:grid-cols-2">
                <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-50 md:aspect-auto" />
                <CardContent className="p-8">
                  <Badge>{featuredPost.category}</Badge>
                  <h2 className="mt-4 text-2xl font-bold text-neutral-900">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-2 text-neutral-600">{featuredPost.excerpt}</p>
                  <div className="mt-6 flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1 text-primary-600">
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.div key={post.slug} variants={staggerItemVariants}>
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <div className="aspect-[16/9] bg-gradient-to-br from-neutral-100 to-neutral-50" />
                  <CardContent className="p-6">
                    <Badge variant="outline">{post.category}</Badge>
                    <h3 className="mt-3 text-lg font-semibold text-neutral-900 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
                      <span>{post.author.name}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerItemVariants}
          className="mt-12 text-center"
        >
          <button className="rounded-lg border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
            Load more posts
          </button>
        </motion.div>
      </div>
    </div>
  );
}
