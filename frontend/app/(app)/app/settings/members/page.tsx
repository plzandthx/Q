'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  MoreVertical,
  Mail,
  Shield,
  Trash2,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageContainer, PageHeader } from '@/components/layout';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion';

// Mock members data - replace with API data
const mockMembers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'owner',
    status: 'active',
    joinedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@company.com',
    role: 'member',
    status: 'active',
    joinedAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@company.com',
    role: 'member',
    status: 'pending',
    joinedAt: null,
  },
];

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

export default function MembersSettingsPage() {
  const [members] = useState(mockMembers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleInvite = () => {
    // TODO: Implement invite API call
    console.log('Invite:', { email: inviteEmail, role: inviteRole });
    setInviteEmail('');
    setIsInviteDialogOpen(false);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Team Members"
        description="Manage who has access to your organization."
        breadcrumbs={[
          { label: 'Settings', href: '/app/settings' },
          { label: 'Team Members' },
        ]}
      >
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  className="mt-1"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Role
                </label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleInvite}>
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants}
        className="space-y-6"
      >
        {/* Stats */}
        <motion.div
          variants={staggerContainerVariants}
          className="grid gap-4 sm:grid-cols-3"
        >
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-500">Total Members</p>
              <p className="text-2xl font-bold">{members.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-500">Active</p>
              <p className="text-2xl font-bold">
                {members.filter((m) => m.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-neutral-500">Pending Invites</p>
              <p className="text-2xl font-bold">
                {members.filter((m) => m.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Members List */}
        <motion.div variants={staggerItemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {member.role === 'owner' && (
                            <Crown className="h-4 w-4 text-amber-500" />
                          )}
                          {member.status === 'pending' && (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{roleLabels[member.role]}</Badge>
                      {member.role !== 'owner' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            {member.status === 'pending' && (
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend Invite
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
