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
import { FloatingIconsSection } from '@/components/ui/floating-icons-section';

// Integration Icons for the floating section
const IconSlack = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#36C5F0"/>
    <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#2EB67D"/>
    <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#ECB22E"/>
    <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#E01E5A"/>
  </svg>
);

const IconZendesk = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.088 7.714V24H0L11.088 7.714zM11.088 0c0 3.065-2.483 5.548-5.544 5.548C2.483 5.548 0 3.065 0 0h11.088zM12.912 24c0-3.065 2.483-5.548 5.544-5.548 3.061 0 5.544 2.483 5.544 5.548H12.912zM12.912 16.286V0H24L12.912 16.286z" fill="#03363D"/>
  </svg>
);

const IconIntercom = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 18.5h-2v-5h2v5zm4 0h-2v-7h2v7zm4 0h-2v-5h2v5zm-12 0h-2v-5h2v5zm12-8h-14v-2h14v2z" fill="#1F8DED"/>
  </svg>
);

const IconSalesforce = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.006 5.41c.818-.863 1.952-1.397 3.21-1.397 1.558 0 2.928.823 3.706 2.059a5.01 5.01 0 0 1 2.01-.422c2.787 0 5.047 2.273 5.047 5.078 0 2.804-2.26 5.078-5.047 5.078a5.03 5.03 0 0 1-1.433-.21 4.2 4.2 0 0 1-3.74 2.3c-.615 0-1.2-.133-1.727-.372a4.904 4.904 0 0 1-4.329 2.612c-2.358 0-4.344-1.657-4.843-3.874A4.647 4.647 0 0 1 0 11.715c0-2.57 2.073-4.653 4.63-4.653.332 0 .656.035.968.102A4.352 4.352 0 0 1 10.006 5.41z" fill="#00A1E0"/>
  </svg>
);

const IconHubSpot = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.164 7.93V5.084a2.198 2.198 0 0 0 1.267-1.984v-.066A2.198 2.198 0 0 0 17.233.836h-.066a2.198 2.198 0 0 0-2.198 2.198v.066c0 .874.51 1.627 1.247 1.98v2.853a5.905 5.905 0 0 0-2.902 1.449l-7.67-5.976a2.558 2.558 0 1 0-1.2 1.544l7.49 5.835a5.928 5.928 0 0 0 .14 6.81l-2.274 2.274a2.123 2.123 0 0 0-.62-.103 2.155 2.155 0 1 0 2.155 2.155c0-.217-.039-.425-.1-.62l2.24-2.24a5.935 5.935 0 1 0 3.69-10.23z" fill="#FF7A59"/>
  </svg>
);

const IconGmail = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
  </svg>
);

const IconJira = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.323 11.33L13.001 1.005 12 0l-7.493 7.493-3.18 3.18a.91.91 0 0 0 0 1.287l6.847 6.847L12 22.6l7.493-7.493.031-.031 3.799-3.745a.91.91 0 0 0 0-1.287zM12 14.675l-2.675-2.675L12 9.325l2.675 2.675L12 14.675z" fill="#2684FF"/>
  </svg>
);

const IconNotion = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-neutral-800" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.213.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.746.327-.746.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.746 0-.933-.234-1.493-.933l-4.573-7.186v6.953l1.446.327s0 .84-1.167.84l-3.22.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.453-.233 4.76 7.278v-6.44l-1.214-.14c-.093-.514.28-.886.747-.933l3.228-.186z"/>
  </svg>
);

const IconZapier = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.124 9.441h5.292l-3.668 3.668 3.668 3.668h-5.292l-3.124-3.668 3.124-3.668zm-6.248 0H3.584l3.668 3.668-3.668 3.668h5.292l3.124-3.668-3.124-3.668zm3.124-5.857v5.292l3.668-3.668 3.668 3.668v-5.292l-3.668-3.124-3.668 3.124zm0 16.832v-5.292l3.668 3.668 3.668-3.668v5.292l-3.668 3.124-3.668-3.124z" fill="#FF4A00"/>
  </svg>
);

const IconSegment = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#52BD94"/>
    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fill="#52BD94"/>
  </svg>
);

const IconMixpanel = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" fill="#7856FF"/>
  </svg>
);

const IconAmplitude = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 19.5h20L12 2zm0 5l6.5 10.5h-13L12 7z" fill="#1E61F0"/>
  </svg>
);

const IconTwilio = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.381 0 0 5.381 0 12s5.381 12 12 12 12-5.381 12-12S18.619 0 12 0zm0 20.4c-4.639 0-8.4-3.761-8.4-8.4S7.361 3.6 12 3.6s8.4 3.761 8.4 8.4-3.761 8.4-8.4 8.4zm3.6-11.4a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zm-4.8 0a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zm4.8 4.8a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0zm-4.8 0a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0z" fill="#F22F46"/>
  </svg>
);

const IconStripe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.846 1.573-2.344 1.573-1.903 0-4.694-.89-6.738-2.065L3.702 22c1.871 1.15 5.166 2 8.687 2 2.612 0 4.826-.621 6.35-1.756 1.691-1.262 2.56-3.15 2.56-5.608-.003-4.166-2.528-5.899-7.323-7.486z" fill="#635BFF"/>
  </svg>
);

const IconMicrosoft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.4 2H2v9.4h9.4V2Z" fill="#F25022"/>
    <path d="M22 2h-9.4v9.4H22V2Z" fill="#7FBA00"/>
    <path d="M11.4 12.6H2V22h9.4V12.6Z" fill="#00A4EF"/>
    <path d="M22 12.6h-9.4V22H22V12.6Z" fill="#FFB900"/>
  </svg>
);

const IconGitHub = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-neutral-800" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

// Integration icons with their positions
const integrationIcons = [
  { id: 1, icon: IconSlack, className: 'top-[8%] left-[8%]' },
  { id: 2, icon: IconZendesk, className: 'top-[15%] right-[10%]' },
  { id: 3, icon: IconIntercom, className: 'bottom-[15%] left-[12%]' },
  { id: 4, icon: IconSalesforce, className: 'bottom-[8%] right-[8%]' },
  { id: 5, icon: IconHubSpot, className: 'top-[5%] left-[28%]' },
  { id: 6, icon: IconGmail, className: 'top-[10%] right-[30%]' },
  { id: 7, icon: IconJira, className: 'bottom-[10%] left-[30%]' },
  { id: 8, icon: IconNotion, className: 'top-[35%] left-[5%]' },
  { id: 9, icon: IconZapier, className: 'top-[40%] right-[6%]' },
  { id: 10, icon: IconSegment, className: 'bottom-[30%] right-[12%]' },
  { id: 11, icon: IconMixpanel, className: 'top-[60%] left-[10%]' },
  { id: 12, icon: IconAmplitude, className: 'top-[5%] left-[50%]' },
  { id: 13, icon: IconTwilio, className: 'bottom-[5%] left-[50%]' },
  { id: 14, icon: IconStripe, className: 'top-[25%] right-[5%]' },
  { id: 15, icon: IconMicrosoft, className: 'bottom-[25%] left-[5%]' },
  { id: 16, icon: IconGitHub, className: 'top-[70%] right-[28%]' },
];

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
              Automate feedback,{' '}
              <span className="text-primary-600">measure the moments that matter,</span>{' '}
              and get insights to improve your business
            </motion.h1>

            <motion.p
              variants={staggerItemVariants}
              className="mx-auto mt-6 max-w-3xl text-lg text-neutral-600"
            >
              Connect integrations to automate your customer feedback all in one place,
              personalize your CSAT dashboard designed around the moments that matter
              to you and your customers, and get AI-powered insights pushed directly
              to your product roadmap ecosystem.
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

      {/* Integrations Section */}
      <FloatingIconsSection
        title="Easily set up and automate your favorite integrations"
        subtitle="Dozens of integrations allow you to quickly and easily connect your customer feedback to the moments that matter across your experience"
        icons={integrationIcons}
      />

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
