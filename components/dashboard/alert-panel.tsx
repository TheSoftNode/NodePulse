import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { IAlert } from '@/lib/types/alert';
import { formatRelativeTime } from '@/lib/utils/date-utils';
import { getSeverityVariant, getSeverityIcon } from '@/lib/utils/status-helpers';
import { AlertTriangle } from 'lucide-react';

interface AlertPanelProps {
  alerts: IAlert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Alerts</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-8">
          No active alerts. All systems operational!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Alerts</h2>
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-100 dark:bg-red-950 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
          {alerts.length}
        </span>
      </div>
      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert) => (
          <Link
            key={alert._id}
            href={`/alerts/${alert._id}`}
            className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span>{getSeverityIcon(alert.severity)}</span>
                  <Badge variant={getSeverityVariant(alert.severity)} className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{alert.message}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatRelativeTime(alert.createdAt)}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {alerts.length > 5 && (
          <Link
            href="/alerts"
            className="text-sm text-green-600 dark:text-blue-400 hover:text-green-700 dark:hover:text-blue-300 font-medium hover:underline block text-center pt-2"
          >
            View all {alerts.length} alerts →
          </Link>
        )}
      </div>
    </div>
  );
}
