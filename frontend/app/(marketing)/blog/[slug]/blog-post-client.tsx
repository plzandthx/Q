'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Twitter, Linkedin, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// TODO: Replace with API/MDX data
const post = {
  slug: 'future-of-customer-feedback',
  title: 'The Future of Customer Feedback: AI-Powered CSAT Analysis',
  excerpt:
    'Discover how artificial intelligence is transforming the way companies understand and act on customer satisfaction data.',
  category: 'Insights',
  author: {
    name: 'Sarah Chen',
    role: 'VP of Customer Success',
    avatar: null,
    bio: 'Sarah has spent 15 years helping companies build customer-centric cultures.',
  },
  date: '2024-03-15',
  readTime: '8 min read',
  content: `
## The Evolution of Customer Feedback

Customer feedback has come a long way from simple comment cards and annual surveys. Today's businesses need real-time, actionable insights that can drive immediate improvements.

### Traditional Approaches Fall Short

Traditional survey methods suffer from several key problems:

- **Low response rates**: Customers are overwhelmed with survey requests
- **Delayed insights**: By the time data is analyzed, it's often too late
- **Surface-level understanding**: Simple ratings miss the nuance
- **Analysis bottlenecks**: Manual review doesn't scale

## Enter AI-Powered Analysis

Artificial intelligence is changing the game for customer feedback. Here's how:

### Automatic Sentiment Analysis

AI can analyze open-ended responses at scale, identifying sentiment, themes, and urgency without human intervention. This means you can process thousands of responses in seconds.

### Predictive Insights

Machine learning models can identify patterns that predict customer behavior—like which satisfied customers are still at risk of churning.

### Real-Time Recommendations

Instead of just reporting on what happened, AI systems can suggest specific actions to improve satisfaction scores.

## Implementing AI-Powered CSAT

Ready to modernize your feedback program? Here are the key steps:

1. **Consolidate your data sources** - Bring all feedback channels together
2. **Choose the right platform** - Look for native AI capabilities
3. **Start with quick wins** - Automate sentiment analysis first
4. **Build feedback loops** - Ensure insights reach the right teams
5. **Measure impact** - Track improvements over time

## The Future is Here

Companies that embrace AI-powered customer feedback analysis are seeing dramatic improvements in response times, insight quality, and ultimately, customer satisfaction scores.

The question isn't whether AI will transform customer feedback—it's whether you'll be leading the change or playing catch-up.
  `,
};

const relatedPosts = [
  {
    slug: 'moments-that-matter-guide',
    title: 'The Complete Guide to Moments That Matter',
    category: 'Best Practices',
  },
  {
    slug: 'persona-segmentation-csat',
    title: 'Why Persona-Based CSAT Segmentation Changes Everything',
    category: 'Strategy',
  },
];

export default function BlogPostClient() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="mt-8"
        >
          <motion.div variants={staggerItemVariants}>
            <Badge>{post.category}</Badge>
          </motion.div>
          <motion.h1
            variants={staggerItemVariants}
            className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl"
          >
            {post.title}
          </motion.h1>
          <motion.p
            variants={staggerItemVariants}
            className="mt-4 text-lg text-neutral-600"
          >
            {post.excerpt}
          </motion.p>

          {/* Meta */}
          <motion.div
            variants={staggerItemVariants}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {post.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-neutral-900">{post.author.name}</p>
                <p className="text-sm text-neutral-500">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-neutral mt-12 max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-p:text-neutral-600 prose-li:text-neutral-600"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
        />

        {/* Share */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-8"
        >
          <p className="text-sm font-medium text-neutral-700">Share this article</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card>
            <CardContent className="flex items-start gap-4 p-6">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {post.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-neutral-900">{post.author.name}</p>
                <p className="text-sm text-neutral-500">{post.author.role}</p>
                <p className="mt-2 text-sm text-neutral-600">{post.author.bio}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <h2 className="text-lg font-semibold text-neutral-900">Related Articles</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <Badge variant="outline" className="text-xs">
                      {relatedPost.category}
                    </Badge>
                    <p className="mt-2 font-medium text-neutral-900">
                      {relatedPost.title}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
