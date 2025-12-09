'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email us',
    description: 'We will respond within 24 hours',
    value: 'hello@qcsat.io',
    href: 'mailto:hello@qcsat.io',
  },
  {
    icon: MessageSquare,
    title: 'Live chat',
    description: 'Available Mon-Fri, 9am-6pm EST',
    value: 'Start a chat',
    href: '#chat',
  },
  {
    icon: Phone,
    title: 'Call us',
    description: 'For enterprise inquiries',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
];

export default function ContactPage() {
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
              Contact
            </Badge>
          </motion.div>
          <motion.h1
            variants={staggerItemVariants}
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
          >
            Get in touch
          </motion.h1>
          <motion.p
            variants={staggerItemVariants}
            className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600"
          >
            Have questions about Q CSAT? We&apos;re here to help. Reach out and
            we&apos;ll get back to you as soon as possible.
          </motion.p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {contactMethods.map((method) => (
            <motion.div key={method.title} variants={staggerItemVariants}>
              <a href={method.href}>
                <Card className="h-full text-center transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <method.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="mt-4 font-semibold text-neutral-900">
                      {method.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {method.description}
                    </p>
                    <p className="mt-2 text-primary-600">{method.value}</p>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainerVariants}
          className="mt-24"
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div variants={staggerItemVariants}>
              <h2 className="text-2xl font-bold text-neutral-900">
                Send us a message
              </h2>
              <p className="mt-4 text-neutral-600">
                Fill out the form and our team will get back to you within 24 hours.
                For urgent matters, please use live chat or phone.
              </p>

              <form className="mt-8 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      First name
                    </label>
                    <Input className="mt-1" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Last name
                    </label>
                    <Input className="mt-1" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Work email
                  </label>
                  <Input className="mt-1" type="email" placeholder="john@company.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Company
                  </label>
                  <Input className="mt-1" placeholder="Acme Inc" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    How can we help?
                  </label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales inquiry</SelectItem>
                      <SelectItem value="support">Technical support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="press">Press inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Message
                  </label>
                  <Textarea
                    className="mt-1"
                    rows={4}
                    placeholder="Tell us more about your needs..."
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Send message
                </Button>
              </form>
            </motion.div>

            <motion.div
              variants={staggerItemVariants}
              className="relative hidden lg:block"
            >
              <Card className="h-full bg-gradient-to-br from-primary-500 to-primary-700">
                <CardContent className="flex h-full flex-col justify-between p-8 text-white">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Ready to transform your customer feedback?
                    </h3>
                    <p className="mt-4 text-primary-100">
                      Join thousands of companies using Q CSAT to understand and
                      improve customer satisfaction.
                    </p>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">San Francisco, CA</p>
                        <p className="text-sm text-primary-100">
                          123 Market Street, Suite 456
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">hello@qcsat.io</p>
                        <p className="text-sm text-primary-100">
                          General inquiries
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
