'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wrench, Clock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="text-center max-w-lg"
      >
        <motion.div variants={staggerItemVariants}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <Wrench className="h-10 w-10 text-primary-600" />
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">
            We&apos;ll be right back
          </h1>
          <p className="mt-2 text-neutral-600">
            Q CSAT is currently undergoing scheduled maintenance. We&apos;re working
            hard to improve your experience.
          </p>
        </motion.div>

        <motion.div
          variants={staggerItemVariants}
          className="mt-8 rounded-xl bg-white p-6 border border-neutral-200"
        >
          <div className="flex items-center justify-center gap-2 text-neutral-500">
            <Clock className="h-5 w-5" />
            <span>Estimated time: 30 minutes</span>
          </div>
          <div className="mt-4 text-sm text-neutral-400">
            Started at 2:00 PM EST
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8">
          <p className="text-sm text-neutral-600 mb-4">
            Get notified when we&apos;re back online:
          </p>
          <div className="flex gap-2 max-w-xs mx-auto">
            <Input placeholder="your@email.com" type="email" />
            <Button>
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8">
          <p className="text-sm text-neutral-500">
            Check our{' '}
            <Link href="/status" className="text-primary-600 hover:underline">
              status page
            </Link>{' '}
            for updates
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
