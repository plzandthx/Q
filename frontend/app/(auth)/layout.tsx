import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link href="/" className="flex items-center mb-8">
            <Logo variant="primary" size="md" showWordmark />
          </Link>
          {children}
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700">
          <div className="flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold">
                Transform customer feedback into growth
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                Join thousands of companies using Q CSAT to understand and improve
                customer satisfaction.
              </p>
              <div className="mt-12 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-sm text-primary-200">Companies</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">50M+</p>
                  <p className="text-sm text-primary-200">Responses</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">4.9</p>
                  <p className="text-sm text-primary-200">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
