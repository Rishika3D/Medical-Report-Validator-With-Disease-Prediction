import React, { useState } from 'react';
import { Card } from './ui/card';
import { User, Bell, Shield, Palette, Database, Zap, Save, Mail, Phone, MapPin } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';

export function SettingsView() {
  const [settings, setSettings] = useState({
    // Profile
    fullName: 'Dr. Gavarkar',
    email: 'doctor@hospital.com',
    phone: '+1 234-567-8900',
    location: 'Medical Center, NY',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    criticalAlerts: true,
    weeklyReports: false,
    systemUpdates: true,
    
    // Privacy
    dataSharing: false,
    analytics: true,
    autoBackup: true,
    
    // Display
    animations: true,
    compactMode: false,
    highContrast: false,
    
    // AI Settings
    autoAnalysis: true,
    predictionThreshold: 75,
    modelVersion: 'v3.2.1'
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleInputChange = (key: string, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-cyan-400 neon-text-cyan">Settings</h2>
        <p className="text-sm text-gray-400 mt-2">Manage your application preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2 p-6 bg-black/60 backdrop-blur-xl neon-border-cyan">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center neon-glow-cyan">
              <User size={20} className="text-black" />
            </div>
            <div>
              <h3 className="text-white">Profile Settings</h3>
              <p className="text-sm text-gray-400">Update your personal information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                value={settings.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="bg-black/40 border-cyan-500/30 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={16} />
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 bg-black/40 border-cyan-500/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={16} />
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10 bg-black/40 border-cyan-500/30 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-300">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={16} />
                <Input
                  id="location"
                  value={settings.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10 bg-black/40 border-cyan-500/30 text-white"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-purple">
          <h3 className="text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-all text-left flex items-center gap-3">
              <User size={18} />
              <span className="text-sm">Change Password</span>
            </button>
            <button className="w-full px-4 py-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-all text-left flex items-center gap-3">
              <Database size={18} />
              <span className="text-sm">Export Data</span>
            </button>
            <button className="w-full px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/20 transition-all text-left flex items-center gap-3">
              <Shield size={18} />
              <span className="text-sm">Privacy Center</span>
            </button>
            <button className="w-full px-4 py-3 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-xl hover:bg-pink-500/20 transition-all text-left flex items-center gap-3">
              <Zap size={18} />
              <span className="text-sm">Clear Cache</span>
            </button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-green">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center neon-glow-green">
              <Bell size={20} className="text-black" />
            </div>
            <div>
              <h3 className="text-white">Notifications</h3>
              <p className="text-sm text-gray-400">Configure alert preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Email Notifications</Label>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Push Notifications</Label>
                <p className="text-xs text-gray-500">Browser notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Critical Alerts</Label>
                <p className="text-xs text-gray-500">High-priority notifications</p>
              </div>
              <Switch
                checked={settings.criticalAlerts}
                onCheckedChange={() => handleToggle('criticalAlerts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Weekly Reports</Label>
                <p className="text-xs text-gray-500">Summary emails</p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={() => handleToggle('weeklyReports')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">System Updates</Label>
                <p className="text-xs text-gray-500">Update notifications</p>
              </div>
              <Switch
                checked={settings.systemUpdates}
                onCheckedChange={() => handleToggle('systemUpdates')}
              />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-pink">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center neon-glow-pink">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white">Privacy & Security</h3>
              <p className="text-sm text-gray-400">Control your data</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Data Sharing</Label>
                <p className="text-xs text-gray-500">Share anonymized data</p>
              </div>
              <Switch
                checked={settings.dataSharing}
                onCheckedChange={() => handleToggle('dataSharing')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Analytics</Label>
                <p className="text-xs text-gray-500">Usage analytics</p>
              </div>
              <Switch
                checked={settings.analytics}
                onCheckedChange={() => handleToggle('analytics')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Auto Backup</Label>
                <p className="text-xs text-gray-500">Daily backups</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={() => handleToggle('autoBackup')}
              />
            </div>
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="p-6 bg-black/60 backdrop-blur-xl neon-border-purple">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center neon-glow-purple">
              <Palette size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white">Display</h3>
              <p className="text-sm text-gray-400">Customize appearance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Animations</Label>
                <p className="text-xs text-gray-500">Enable animations</p>
              </div>
              <Switch
                checked={settings.animations}
                onCheckedChange={() => handleToggle('animations')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">Compact Mode</Label>
                <p className="text-xs text-gray-500">Reduce spacing</p>
              </div>
              <Switch
                checked={settings.compactMode}
                onCheckedChange={() => handleToggle('compactMode')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300">High Contrast</Label>
                <p className="text-xs text-gray-500">Accessibility mode</p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={() => handleToggle('highContrast')}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 bg-black/60 border border-gray-700 text-gray-400 rounded-xl hover:border-gray-600 transition-all">
          Cancel
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all neon-glow-cyan flex items-center gap-2">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
