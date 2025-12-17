'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PixelTrail } from '@/components/ui/pixel-trail';
import { useScreenSize } from '@/components/hooks/use-screen-size';
import { Button } from '@/components/ui/button';
import { staggerItemVariants } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface CSATDashboardEmptyStateProps {
  className?: string;
}

export function CSATDashboardEmptyState({ className }: CSATDashboardEmptyStateProps) {
  const screenSize = useScreenSize();

  return (
    <motion.div
      variants={staggerItemVariants}
      className={cn('mt-8 md:mt-12', className)}
    >
      <div className="relative w-full min-h-[500px] bg-[#E5E9E2] rounded-2xl overflow-hidden">
        {/* Pixel Trail Animation Background */}
        <div className="absolute inset-0 z-0">
          <PixelTrail
            pixelSize={screenSize.lessThan('md') ? 48 : 64}
            fadeDuration={0}
            delay={1200}
            pixelClassName="rounded-full bg-[#a4d08b]/70"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-[500px] pointer-events-none px-4">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-[#3d8b8b] text-center max-w-lg leading-tight">
            Connect the dots between your customer feedback and business insights
          </h2>
          <div className="mt-8 pointer-events-auto">
            <Button
              asChild
              size="xl"
              className="bg-[#3d8b8b] hover:bg-[#357878] text-white"
            >
              <Link href="/app/projects/new">
                Start your first project
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
