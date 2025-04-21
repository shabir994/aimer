import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Volume2,
  Smartphone,
  Shield,
  Eye,
  KeyRound,
  Languages,
  Mail,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardAPI, UserSettings } from '../lib/api/mockData';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ];

  const timezones = [
    'UTC-12:00',
    'UTC-11:00',
    'UTC-10:00',
    'UTC-09:00',
    'UTC-08:00',
    'UTC-07:00',
    'UTC-06:00',
    'UTC-05:00',
    'UTC-04:00',
    'UTC-03:00',
    'UTC-02:00',
    'UTC-01:00',
    'UTC+00:00',
    'UTC+01:00',
    'UTC+02:00',
    'UTC+03:00',
    'UTC+04:00',
    'UTC+05:00',
    'UTC+06:00',
    'UTC+07:00',
    'UTC+08:00',
    'UTC+09:00',
    'UTC+10:00',
    'UTC+11:00',
    'UTC+12:00'
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getUserSettings();
      setSettings(data);
      setTheme(data.theme);
    } catch (error) {
      setError('Failed to load settings');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingToggle = async (
    category: 'notifications' | 'privacy',
    setting: string
  ) => {
    if (!settings) return;

    try {
      setError(null);
      let updatedSettings;

      switch (category) {
        case 'notifications':
          updatedSettings = await dashboardAPI.updateNotificationPreferences({
            [setting]: !settings.notifications[setting as keyof typeof settings.notifications]
          });
          setSettings(prev => prev ? {
            ...prev,
            notifications: updatedSettings
          } : null);
          break;

        case 'privacy':
          updatedSettings = await dashboardAPI.updatePrivacyPreferences({
            [setting]: !settings.privacy[setting as keyof typeof settings.privacy]
          });
          setSettings(prev => prev ? {
            ...prev,
            privacy: updatedSettings
          } : null);
          break;
      }

      setSuccess('Settings updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update settings');
      console.error('Error updating settings:', error);
    }
  };

  const handlePreferenceChange = async (setting: string, value: string | number) => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);

      const updatedSettings = await dashboardAPI.updateUserSettings({
        [setting]: value
      });

      setSettings(updatedSettings);

      if (setting === 'theme') {
        setTheme(value as 'light' | 'dark');
      }

      setSuccess('Settings updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update settings');
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg max-w-md text-center">
          <p>Failed to load settings</p>
          <button
            onClick={fetchSettings}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your app preferences and account settings</p>
      </div>

      {/* Status Messages */}
      {(error || success) && (
        <div className={`p-4 rounded-lg ${
          error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          <div className="flex items-center gap-2">
            {error ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            <p>{error || success}</p>
          </div>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'emailUpdates', icon: Mail, label: 'Email Notifications', description: 'Receive email updates' },
              { key: 'push', icon: Smartphone, label: 'Push Notifications', description: 'Enable push notifications' },
              { key: 'inApp', icon: MessageSquare, label: 'In-App Notifications', description: 'Show in-app notifications' },
              { key: 'marketing', icon: Bell, label: 'Marketing Emails', description: 'Receive marketing updates' },
              { key: 'updates', icon: Bell, label: 'Product Updates', description: 'Get product update notifications' },
              { key: 'sound', icon: Volume2, label: 'Sound Effects', description: 'Enable notification sounds' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('notifications', item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    settings.notifications[item.key as keyof typeof settings.notifications]
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.notifications[item.key as keyof typeof settings.notifications]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy & Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'twoFactor', icon: Lock, label: 'Two-Factor Authentication', description: 'Add an extra layer of security' },
              { key: 'activityStatus', icon: Eye, label: 'Activity Status', description: 'Show when you\'re active' },
              { key: 'readReceipts', icon: Check, label: 'Read Receipts', description: 'Show when you\'ve read messages' },
              { key: 'dataCollection', icon: Shield, label: 'Data Collection', description: 'Allow data collection for better service' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSettingToggle('privacy', item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    settings.privacy[item.key as keyof typeof settings.privacy]
                      ? 'bg-purple-600'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.privacy[item.key as keyof typeof settings.privacy]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}

            <div className="p-4 bg-purple-50 dark:bg-purple-900/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Your security is our top priority. Enable two-factor authentication for enhanced account protection.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Language & Region Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Language & Region</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Zone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white"
              >
                {timezones.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-xl flex items-start gap-3">
              <Languages className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600 dark:text-green-400">
                Content and notifications will be displayed in your selected language and time zone.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Appearance & Sound Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Moon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance & Sound</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'light', icon: Sun },
                  { id: 'dark', icon: Moon }
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handlePreferenceChange('theme', id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      theme === id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/50'
                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-200 dark:hover:border-orange-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${theme === id ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`} />
                        <span className="capitalize text-gray-900 dark:text-white font-medium">
                          {id}
                        </span>
                      </div>
                      {theme === id && (
                        <Check className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sound Volume
              </label>
              <div className="flex items-center gap-4">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => handlePreferenceChange('volume', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3ch]">
                  {settings.volume}%
                </span>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Theme changes will be applied immediately across the entire application.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button
          onClick={() => handlePreferenceChange('theme', theme)}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;