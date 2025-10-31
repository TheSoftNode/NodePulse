'use client';

import { RefreshCw } from 'lucide-react';
import { NotificationsDropdown } from './notifications-dropdown';
import { ThemeToggle } from '@/components/theme-toggle';

interface Notification {
  _id: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: Date;
  nodeId?: string;
}

interface HeaderProps {
  title?: string;
  notifications?: Notification[];
}

export function Header({ title = 'Dashboard', notifications = [] }: HeaderProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 lg:px-8">
      <div className="ml-12 lg:ml-0">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications dropdown */}
        <NotificationsDropdown notifications={notifications} />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
