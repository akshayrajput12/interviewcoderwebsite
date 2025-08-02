'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface AdminSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
  credits: {
    freeUserCredits: number;
    monthlyUserCredits: number;
    yearlyUserCredits: number;
    creditResetDay: number;
  };
  pricing: {
    monthlyPrice: number;
    yearlyPrice: number;
    yearlyDiscount: number;
  };
  notifications: {
    emailNotifications: boolean;
    lowCreditWarning: boolean;
    lowCreditThreshold: number;
    welcomeEmail: boolean;
  };
  security: {
    passwordMinLength: number;
    requireEmailVerification: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof AdminSettings, key: string, value: unknown) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'credits', name: 'Credits', icon: CurrencyDollarIcon },
    { id: 'pricing', name: 'Pricing', icon: DocumentTextIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <p className="text-gray-400 mt-2">Configure platform settings and preferences</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-gray-800 shadow rounded-lg p-6">
            {activeTab === 'general' && settings && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-white">General Settings</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Site Name</label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Site Description</label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => updateSettings('general', 'maintenanceMode', e.target.checked)}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-300">Maintenance Mode</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.registrationEnabled}
                      onChange={(e) => updateSettings('general', 'registrationEnabled', e.target.checked)}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-300">Allow New Registrations</label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'credits' && settings && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-white">Credit Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Free User Credits</label>
                    <input
                      type="number"
                      value={settings.credits.freeUserCredits}
                      onChange={(e) => updateSettings('credits', 'freeUserCredits', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Monthly User Credits</label>
                    <input
                      type="number"
                      value={settings.credits.monthlyUserCredits}
                      onChange={(e) => updateSettings('credits', 'monthlyUserCredits', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Yearly User Credits</label>
                    <input
                      type="number"
                      value={settings.credits.yearlyUserCredits}
                      onChange={(e) => updateSettings('credits', 'yearlyUserCredits', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Credit Reset Day (1-31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={settings.credits.creditResetDay}
                      onChange={(e) => updateSettings('credits', 'creditResetDay', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pricing' && settings && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-white">Pricing Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Monthly Price (₹)</label>
                    <input
                      type="number"
                      value={settings.pricing.monthlyPrice}
                      onChange={(e) => updateSettings('pricing', 'monthlyPrice', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Yearly Price (₹)</label>
                    <input
                      type="number"
                      value={settings.pricing.yearlyPrice}
                      onChange={(e) => updateSettings('pricing', 'yearlyPrice', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Yearly Discount (%)</label>
                    <input
                      type="number"
                      value={settings.pricing.yearlyDiscount}
                      onChange={(e) => updateSettings('pricing', 'yearlyDiscount', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && settings && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-white">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSettings('notifications', 'emailNotifications', e.target.checked)}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-300">Enable Email Notifications</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.lowCreditWarning}
                      onChange={(e) => updateSettings('notifications', 'lowCreditWarning', e.target.checked)}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-300">Low Credit Warnings</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Low Credit Threshold</label>
                    <input
                      type="number"
                      value={settings.notifications.lowCreditThreshold}
                      onChange={(e) => updateSettings('notifications', 'lowCreditThreshold', parseInt(e.target.value))}
                      className="mt-1 block w-full max-w-xs px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.welcomeEmail}
                      onChange={(e) => updateSettings('notifications', 'welcomeEmail', e.target.checked)}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-300">Send Welcome Emails</label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && settings && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-white">Security Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Minimum Password Length</label>
                    <input
                      type="number"
                      min="6"
                      max="50"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Max Login Attempts</label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.requireEmailVerification}
                      onChange={(e) => updateSettings('security', 'requireEmailVerification', e.target.checked)}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-600 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-300">Require Email Verification</label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
