'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Smartphone,
  Key,
  AlertTriangle,
  Check,
  X,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// Mock security data - replace with API data
const securitySettings = {
  twoFactorEnabled: false,
  passwordLastChanged: '30 days ago',
  loginHistory: [
    {
      id: '1',
      device: 'Chrome on macOS',
      location: 'San Francisco, CA',
      time: 'Just now',
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      time: '2 hours ago',
      current: false,
    },
    {
      id: '3',
      device: 'Firefox on Windows',
      location: 'New York, NY',
      time: '1 day ago',
      current: false,
    },
  ],
};

export default function SecuritySettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    securitySettings.twoFactorEnabled
  );
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');

  // Mock secret for 2FA setup
  const mockSecret = 'JBSW Y3DP EHPK 3PXP';

  const handleEnable2FA = () => {
    // TODO: Implement 2FA verification API call
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowSetupDialog(false);
      setSetupStep(1);
      setVerificationCode('');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Security"
        description="Manage your account security settings."
        breadcrumbs={[
          { label: 'Settings', href: '/app/settings' },
          { label: 'Security' },
        ]}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="max-w-2xl space-y-6"
      >
        {/* Two-Factor Authentication */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {twoFactorEnabled ? (
                    <Badge variant="default" className="bg-green-500">
                      <Check className="mr-1 h-3 w-3" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <X className="mr-1 h-3 w-3" />
                      Disabled
                    </Badge>
                  )}
                  <span className="text-sm text-neutral-500">
                    {twoFactorEnabled
                      ? 'Your account is protected with 2FA'
                      : 'Protect your account with 2FA'}
                  </span>
                </div>

                {twoFactorEnabled ? (
                  <Button
                    variant="outline"
                    onClick={() => setTwoFactorEnabled(false)}
                  >
                    Disable
                  </Button>
                ) : (
                  <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Shield className="mr-2 h-4 w-4" />
                        Enable 2FA
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
                        <DialogDescription>
                          Scan the QR code with your authenticator app.
                        </DialogDescription>
                      </DialogHeader>

                      {setupStep === 1 && (
                        <div className="py-4 space-y-4">
                          <div className="flex justify-center">
                            <div className="w-48 h-48 bg-neutral-100 rounded-lg flex items-center justify-center">
                              <p className="text-neutral-500 text-sm">QR Code</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-neutral-500 mb-2">
                              Or enter this code manually:
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <code className="bg-neutral-100 px-4 py-2 rounded font-mono">
                                {mockSecret}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  navigator.clipboard.writeText(mockSecret)
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {setupStep === 2 && (
                        <div className="py-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Enter the 6-digit code from your app
                            </label>
                            <Input
                              className="text-center text-2xl tracking-widest"
                              maxLength={6}
                              placeholder="000000"
                              value={verificationCode}
                              onChange={(e) =>
                                setVerificationCode(
                                  e.target.value.replace(/\D/g, '')
                                )
                              }
                            />
                          </div>
                        </div>
                      )}

                      <DialogFooter>
                        {setupStep === 1 ? (
                          <Button onClick={() => setSetupStep(2)}>
                            Continue
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => setSetupStep(1)}
                            >
                              Back
                            </Button>
                            <Button
                              onClick={handleEnable2FA}
                              disabled={verificationCode.length !== 6}
                            >
                              Verify & Enable
                            </Button>
                          </>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-neutral-500">
                    Last changed {securitySettings.passwordLastChanged}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href="/app/settings/account">Change Password</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login History */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Recent sign-in activity on your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {securitySettings.loginHistory.map((login) => (
                  <div
                    key={login.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{login.device}</p>
                        {login.current && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">
                        {login.location} • {login.time}
                      </p>
                    </div>
                    {!login.current && (
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Recommendations */}
        <motion.div variants={staggerItemVariants}>
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
                Security Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {!twoFactorEnabled && (
                  <li className="flex items-center gap-3 text-sm">
                    <X className="h-4 w-4 text-red-500" />
                    <span>Enable two-factor authentication</span>
                  </li>
                )}
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Strong password in use</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Email verified</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
