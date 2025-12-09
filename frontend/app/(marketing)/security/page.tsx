'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Server,
  Eye,
  FileCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Encryption',
    description:
      'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
  },
  {
    icon: Server,
    title: 'Infrastructure',
    description:
      'Hosted on AWS with SOC 2 certified data centers. Multi-region redundancy for high availability.',
  },
  {
    icon: Eye,
    title: 'Access Control',
    description:
      'Role-based access control, SSO/SAML support, and multi-factor authentication.',
  },
  {
    icon: FileCheck,
    title: 'Compliance',
    description:
      'SOC 2 Type II certified. GDPR and CCPA compliant. Regular third-party audits.',
  },
  {
    icon: Users,
    title: 'Data Isolation',
    description:
      'Strict tenant isolation ensures your data is never mixed with other customers.',
  },
  {
    icon: AlertTriangle,
    title: 'Monitoring',
    description:
      '24/7 security monitoring, intrusion detection, and automated threat response.',
  },
];

const certifications = [
  { name: 'SOC 2 Type II', description: 'Service organization controls certification' },
  { name: 'GDPR', description: 'EU General Data Protection Regulation' },
  { name: 'CCPA', description: 'California Consumer Privacy Act' },
  { name: 'ISO 27001', description: 'Information security management (in progress)' },
];

const practices = [
  'Regular penetration testing by third-party security firms',
  'Bug bounty program for responsible disclosure',
  'Security awareness training for all employees',
  'Secure software development lifecycle (SDLC)',
  'Regular dependency scanning and updates',
  'Incident response plan with defined SLAs',
  'Data backup and disaster recovery procedures',
  'Vendor security assessments',
];

export default function SecurityPage() {
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
              Security
            </Badge>
          </motion.div>
          <motion.h1
            variants={staggerItemVariants}
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
          >
            Enterprise-grade security
          </motion.h1>
          <motion.p
            variants={staggerItemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600"
          >
            Your customer data is precious. We protect it with industry-leading
            security practices, rigorous compliance standards, and transparent
            operations.
          </motion.p>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {securityFeatures.map((feature) => (
            <motion.div key={feature.title} variants={staggerItemVariants}>
              <Card className="h-full">
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

        {/* Certifications */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-24"
        >
          <motion.h2
            variants={staggerItemVariants}
            className="text-center text-2xl font-bold text-neutral-900"
          >
            Certifications & Compliance
          </motion.h2>
          <motion.div
            variants={staggerContainerVariants}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {certifications.map((cert) => (
              <motion.div key={cert.name} variants={staggerItemVariants}>
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <Shield className="mx-auto h-10 w-10 text-primary-500" />
                    <h3 className="mt-4 font-semibold text-neutral-900">{cert.name}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{cert.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Security Practices */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-24"
        >
          <motion.h2
            variants={staggerItemVariants}
            className="text-center text-2xl font-bold text-neutral-900"
          >
            Security Practices
          </motion.h2>
          <motion.div
            variants={staggerContainerVariants}
            className="mt-12 mx-auto max-w-3xl"
          >
            <Card>
              <CardContent className="p-8">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {practices.map((practice) => (
                    <motion.li
                      key={practice}
                      variants={staggerItemVariants}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary-500" />
                      <span className="text-neutral-700">{practice}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerItemVariants}
          className="mt-24 text-center"
        >
          <Card className="mx-auto max-w-2xl">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-neutral-900">
                Security Questions?
              </h2>
              <p className="mt-2 text-neutral-600">
                Our security team is happy to answer questions and provide additional
                documentation for your security review.
              </p>
              <p className="mt-4">
                <a
                  href="mailto:security@qcsat.io"
                  className="text-primary-600 hover:underline"
                >
                  security@qcsat.io
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
