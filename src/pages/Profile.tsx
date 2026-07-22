import { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Input, PasswordInput } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { User, Mail, Shield, Save, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Admin User');
  const [email, setEmail] = useState(user?.email || 'admin@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Account Profile & Settings"
        description="Manage your administrator credentials and security preferences"
        breadcrumb={[{ label: 'Profile' }]}
      />

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Personal Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={name || 'User'} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">{name}</span>
                  <Badge variant="success" dot className="capitalize">
                    {user?.role || 'admin'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Authorized Proctor & System Overseer</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="h-4 w-4 text-slate-400" />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                required
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-olive/15 bg-secondary-bg/40 p-3.5 text-xs text-slate-600">
              <Shield className="h-4 w-4 text-primary flex-shrink-0" />
              <span>
                Account privileges: <span className="font-semibold text-slate-900 capitalize">{user?.role || 'admin'}</span> (Full read/write access to camera streams & reports).
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
                Save Changes
              </Button>

              <AnimatePresence>
                {profileSuccess && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-success"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Profile updated successfully!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security & Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            Security & Change Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            {passwordError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">
                {passwordError}
              </div>
            )}

            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="secondary">
                Update Password
              </Button>

              <AnimatePresence>
                {passwordSuccess && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-success"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Password updated!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
