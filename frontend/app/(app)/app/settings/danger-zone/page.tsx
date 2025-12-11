'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2, Download, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

export default function DangerZoneSettingsPage() {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [orgDeleteConfirmation, setOrgDeleteConfirmation] = useState('');

  const handleExportData = () => {
    // TODO: Implement data export API call
    console.log('Export data');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion API call
    console.log('Delete account');
  };

  const handleDeleteOrganization = () => {
    // TODO: Implement organization deletion API call
    console.log('Delete organization');
  };

  const handleLeaveOrganization = () => {
    // TODO: Implement leave organization API call
    console.log('Leave organization');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Danger Zone"
        description="Irreversible and destructive actions."
        breadcrumbs={[
          { label: 'Settings', href: '/app/settings' },
          { label: 'Danger Zone' },
        ]}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="max-w-2xl space-y-6"
      >
        {/* Warning */}
        <motion.div variants={staggerItemVariants}>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800">
                    Proceed with caution
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Actions on this page are permanent and cannot be undone.
                    Please make sure you understand the consequences before
                    proceeding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Export Data */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Export Your Data</CardTitle>
              <CardDescription>
                Download a copy of all your data before making any destructive
                changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">
                    This will export all your projects, responses, and settings
                    as a ZIP file.
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leave Organization */}
        <motion.div variants={staggerItemVariants}>
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <UserX className="h-5 w-5" />
                Leave Organization
              </CardTitle>
              <CardDescription>
                Remove yourself from the organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">
                    You will lose access to all organization resources. You can
                    be re-invited later.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-amber-600 border-amber-300 hover:bg-amber-50">
                      Leave Organization
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Leave Organization?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will immediately lose access to all organization
                        data, projects, and settings. An admin can re-invite you
                        later if needed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLeaveOrganization}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        Leave Organization
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Account */}
        <motion.div variants={staggerItemVariants}>
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Delete Account
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-neutral-600">
                This will permanently delete your account, including all your
                personal data and settings. This action cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your data will be
                      permanently removed. Type <strong>delete my account</strong>{' '}
                      to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="delete my account"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== 'delete my account'}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Organization */}
        <motion.div variants={staggerItemVariants}>
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Organization
              </CardTitle>
              <CardDescription>
                Permanently delete this organization and all its data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-neutral-600">
                This will permanently delete the organization, including all
                projects, responses, widgets, and member data. All members will
                lose access immediately.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Organization
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Organization?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all organization data,
                      including all projects and survey responses. Type{' '}
                      <strong>Acme Inc</strong> to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Organization name"
                      value={orgDeleteConfirmation}
                      onChange={(e) => setOrgDeleteConfirmation(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setOrgDeleteConfirmation('')}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteOrganization}
                      disabled={orgDeleteConfirmation !== 'Acme Inc'}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Organization
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
