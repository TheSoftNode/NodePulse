'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, CheckCircle2, Activity, X } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/date-utils';

interface Notification {
  _id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: Date;
  nodeId?: string;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
}

export function NotificationsDropdown({ notifications }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <Activity className="h-4 w-4 text-violet-600 dark:text-cyan-400" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-600 dark:border-l-red-400 bg-red-50 dark:bg-red-950/20';
      case 'warning':
        return 'border-l-violet-600 dark:border-l-cyan-400 bg-violet-50 dark:bg-cyan-950/20';
      default:
        return 'border-l-green-600 dark:border-l-blue-400 bg-green-50 dark:bg-blue-950/20';
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 dark:bg-red-500 px-1 text-xs font-medium text-white animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 z-50 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No new notifications</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.slice(0, 10).map((notification) => (
                    <Link
                      key={notification._id}
                      href={notification.nodeId ? `/nodes/${notification.nodeId}` : '/alerts'}
                      onClick={() => setIsOpen(false)}
                      className={`block p-4 border-l-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${getSeverityColor(notification.severity)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(notification.severity)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-3">
                <Link
                  href="/alerts"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm font-medium text-green-600 dark:text-blue-400 hover:text-green-700 dark:hover:text-blue-300 transition-colors"
                >
                  View all alerts →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
