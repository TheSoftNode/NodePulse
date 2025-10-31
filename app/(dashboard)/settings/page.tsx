'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Settings,
  Bell,
  Shield,
  Database,
  Mail,
  Webhook,
  Clock,
  Zap,
  Brain,
  Save,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Configure your NodePulse instance and monitoring preferences
        </p>
      </div>

      {/* Appearance Settings */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            <CardTitle className="text-slate-900 dark:text-slate-100">Appearance</CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Theme</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Switch between light and dark mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Settings */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-slate-900 dark:text-slate-100">Monitoring</CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Configure health check intervals and monitoring behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Default Check Interval
            </label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500">
              <option value="30">30 seconds</option>
              <option value="60" selected>1 minute</option>
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
              <option value="1800">30 minutes</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              How often to check node health by default
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Timeout Threshold
            </label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500">
              <option value="5000">5 seconds</option>
              <option value="10000" selected>10 seconds</option>
              <option value="30000">30 seconds</option>
              <option value="60000">60 seconds</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Maximum time to wait for a health check response
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Auto-retry failed checks</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Automatically retry once when a check fails
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-green-600 dark:text-blue-600 focus:ring-green-500 dark:focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI & Insights Settings */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600 dark:text-cyan-400" />
            <CardTitle className="text-slate-900 dark:text-slate-100">AI & Insights</CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Configure AI-powered predictions and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Predictive Failure Detection</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Use ML to predict failures before they happen
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-green-600 dark:text-blue-600 focus:ring-green-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Earnings Optimization</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Get AI-powered recommendations to increase revenue
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-green-600 dark:text-blue-600 focus:ring-green-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Anomaly Detection</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Automatically detect unusual patterns in node behavior
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-green-600 dark:text-blue-600 focus:ring-green-500 dark:focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle className="text-slate-900 dark:text-slate-100">Alerts & Notifications</CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Configure how and when you receive alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Alert Channels
            </label>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Email Notifications</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Send alerts via email</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-green-600 dark:text-blue-600 focus:ring-green-500 dark:focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <Webhook className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Webhook Integration</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Send alerts to custom webhooks</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-green-600 dark:text-blue-600 focus:ring-green-500 dark:focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Alert Severity Threshold
            </label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500">
              <option value="low">Low and above</option>
              <option value="medium" selected>Medium and above</option>
              <option value="high">High only</option>
              <option value="critical">Critical only</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Minimum severity level to trigger notifications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600 dark:text-blue-400" />
            <CardTitle className="text-slate-900 dark:text-slate-100">Data Management</CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Control data retention and storage settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Health Check Retention
            </label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500">
              <option value="7">7 days</option>
              <option value="30" selected>30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              <option value="-1">Forever</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              How long to keep health check history
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Alert History Retention
            </label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500">
              <option value="30">30 days</option>
              <option value="90" selected>90 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              How long to keep alert records
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clean Old Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-slate-900 dark:text-slate-100">Security</CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Manage authentication and access control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">API Access</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Enable external API access with authentication
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-green-600 dark:text-blue-600 focus:ring-green-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              API Key
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value="npk_••••••••••••••••••••••••"
                readOnly
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Use this key to authenticate API requests
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <CardTitle className="text-slate-900 dark:text-slate-100">Performance</CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Optimize performance and resource usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Real-time Updates</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Stream live updates via Server-Sent Events
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-green-600 dark:text-blue-600 focus:ring-green-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Max Concurrent Checks
            </label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500">
              <option value="5">5 nodes</option>
              <option value="10" selected>10 nodes</option>
              <option value="20">20 nodes</option>
              <option value="50">50 nodes</option>
              <option value="-1">Unlimited</option>
            </select>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Maximum nodes to check simultaneously
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="outline"
          className="border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Reset to Defaults
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-600 dark:bg-blue-600 hover:bg-green-700 dark:hover:bg-blue-700 text-white shadow-sm"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
