'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

export default function AppNotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    // Use router.back() for proper SPA navigation
    router.back();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="text-center max-w-lg w-full"
      >
        <motion.div variants={staggerItemVariants}>
          <div className="text-[100px] font-bold text-neutral-200 leading-none">
            404
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">
            Page not found
          </h1>
          <p className="mt-2 text-neutral-600">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </motion.div>

        <motion.div
          variants={staggerItemVariants}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button asChild>
            <Link href="/app">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div variants={staggerItemVariants} className="mt-10">
          <p className="text-sm text-neutral-500 mb-4">
            Quick navigation
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <Card className="hover:border-primary-300 transition-colors">
              <Link href="/app/projects">
                <CardContent className="p-4 flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium">Projects</span>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:border-primary-300 transition-colors">
              <Link href="/app/widgets">
                <CardContent className="p-4 flex items-center gap-3">
                  <Search className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium">Widgets</span>
                </CardContent>
              </Link>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mt-8">
          <p className="text-sm text-neutral-500">
            Need help?{' '}
            <Link href="/app/settings" className="text-primary-600 hover:underline">
              Contact support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
