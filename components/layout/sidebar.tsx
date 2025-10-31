'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Home,
  Server,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'text-slate-700' },
  { name: 'Nodes', href: '/nodes', icon: Server, color: 'text-green-600' },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle, color: 'text-red-600' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'text-violet-600' },
  { name: 'Settings', href: '/settings', icon: Settings, color: 'text-slate-700' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center lg:hidden rounded-lg bg-green-600 dark:bg-blue-600 p-2.5 shadow-lg hover:bg-green-700 dark:hover:bg-blue-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 dark:bg-slate-950/80 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300',
          'lg:static lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'lg:w-20' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-6 justify-between">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 dark:bg-blue-600 flex-shrink-0">
              <Activity className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-xl font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">NodePulse</span>
            )}
          </div>
          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center rounded-lg p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-green-50 dark:bg-blue-950 text-green-700 dark:text-blue-400 shadow-sm border border-green-200 dark:border-blue-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-green-600 dark:text-blue-400' : item.color,
                    !isCollapsed && 'mr-3'
                  )}
                />
                {!isCollapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-blue-950">
                <span className="text-xs font-semibold text-violet-600 dark:text-blue-400">AI</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100">AI-Powered</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">v1.0.0</p>
              </div>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950 flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-blue-950">
              <span className="text-xs font-semibold text-violet-600 dark:text-blue-400">AI</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
