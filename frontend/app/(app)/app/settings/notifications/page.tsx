'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// Mock notification settings - replace with API data
const defaultSettings = {
  email: {
    weeklyReport: true,
    csatAlerts: true,
    responseNotifications: false,
    productUpdates: true,
    marketingEmails: false,
  },
  inApp: {
    csatAlerts: true,
    responseNotifications: true,
    teamActivity: true,
    systemUpdates: true,
  },
  slack: {
    enabled: true,
    csatAlerts: true,
    dailySummary: true,
  },
};

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isDirty, setIsDirty] = useState(false);

  const updateSetting = (
    category: 'email' | 'inApp' | 'slack',
    key: string,
    value: boolean
  ) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    });
    setIsDirty(true);
  };

  const handleSave = () => {
    // TODO: Implement save API call
    console.log('Save notifications:', settings);
    setIsDirty(false);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        description="Manage how and when you receive notifications."
        breadcrumbs={[
          { label: 'Settings', href: '/app/settings' },
          { label: 'Notifications' },
        ]}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="max-w-2xl space-y-6"
      >
        {/* Email Notifications */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose what emails you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Report</p>
                  <p className="text-sm text-neutral-500">
                    Get a summary of your CSAT metrics every Monday
                  </p>
                </div>
                <Switch
                  checked={settings.email.weeklyReport}
                  onCheckedChange={(checked) =>
                    updateSetting('email', 'weeklyReport', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CSAT Alerts</p>
                  <p className="text-sm text-neutral-500">
                    Get notified when scores drop below threshold
                  </p>
                </div>
                <Switch
                  checked={settings.email.csatAlerts}
                  onCheckedChange={(checked) =>
                    updateSetting('email', 'csatAlerts', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Response Notifications</p>
                  <p className="text-sm text-neutral-500">
                    Get notified for each new survey response
                  </p>
                </div>
                <Switch
                  checked={settings.email.responseNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting('email', 'responseNotifications', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Updates</p>
                  <p className="text-sm text-neutral-500">
                    News about new features and improvements
                  </p>
                </div>
                <Switch
                  checked={settings.email.productUpdates}
                  onCheckedChange={(checked) =>
                    updateSetting('email', 'productUpdates', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-neutral-500">
                    Tips, best practices, and promotional content
                  </p>
                </div>
                <Switch
                  checked={settings.email.marketingEmails}
                  onCheckedChange={(checked) =>
                    updateSetting('email', 'marketingEmails', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* In-App Notifications */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                In-App Notifications
              </CardTitle>
              <CardDescription>
                Configure notifications within the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CSAT Alerts</p>
                  <p className="text-sm text-neutral-500">
                    Show alerts for score changes
                  </p>
                </div>
                <Switch
                  checked={settings.inApp.csatAlerts}
                  onCheckedChange={(checked) =>
                    updateSetting('inApp', 'csatAlerts', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Response Notifications</p>
                  <p className="text-sm text-neutral-500">
                    Show notification for new responses
                  </p>
                </div>
                <Switch
                  checked={settings.inApp.responseNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting('inApp', 'responseNotifications', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Team Activity</p>
                  <p className="text-sm text-neutral-500">
                    Updates about team member actions
                  </p>
                </div>
                <Switch
                  checked={settings.inApp.teamActivity}
                  onCheckedChange={(checked) =>
                    updateSetting('inApp', 'teamActivity', checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Updates</p>
                  <p className="text-sm text-neutral-500">
                    Maintenance and system notifications
                  </p>
                </div>
                <Switch
                  checked={settings.inApp.systemUpdates}
                  onCheckedChange={(checked) =>
                    updateSetting('inApp', 'systemUpdates', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Slack Notifications */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Slack Notifications
              </CardTitle>
              <CardDescription>
                Get notifications in your Slack workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Slack</p>
                  <p className="text-sm text-neutral-500">
                    Send notifications to Slack
                  </p>
                </div>
                <Switch
                  checked={settings.slack.enabled}
                  onCheckedChange={(checked) =>
                    updateSetting('slack', 'enabled', checked)
                  }
                />
              </div>
              {settings.slack.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">CSAT Alerts</p>
                      <p className="text-sm text-neutral-500">
                        Post alerts to your channel
                      </p>
                    </div>
                    <Switch
                      checked={settings.slack.csatAlerts}
                      onCheckedChange={(checked) =>
                        updateSetting('slack', 'csatAlerts', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Summary</p>
                      <p className="text-sm text-neutral-500">
                        Post daily CSAT summary
                      </p>
                    </div>
                    <Switch
                      checked={settings.slack.dailySummary}
                      onCheckedChange={(checked) =>
                        updateSetting('slack', 'dailySummary', checked)
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </Button>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  );
}
