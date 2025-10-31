'use client';

import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/date-utils';

interface ActivityItem {
  id: string;
  type: 'health_check' | 'alert' | 'status_change';
  nodeName: string;
  message: string;
  timestamp: Date;
  status?: 'success' | 'failure' | 'warning';
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Connect to SSE for real-time updates
    const eventSource = new EventSource('/api/sse/updates');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'health_check_update' && data.checks) {
          const newActivities = data.checks.slice(0, 5).map((check: any) => ({
            id: check._id,
            type: 'health_check' as const,
            nodeName: 'Node',
            message: `Health check ${check.status === 'success' ? 'passed' : 'failed'}`,
            timestamp: new Date(check.checkedAt),
            status: check.status,
          }));

          setActivities(prev => [...newActivities, ...prev].slice(0, 10));
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-violet-600 dark:text-cyan-400 animate-pulse" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Live Activity</h2>
      </div>
      <div className="space-y-2">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-8">
            Waiting for activity...
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div
                className={`h-2 w-2 rounded-full mt-2 ${
                  activity.status === 'success'
                    ? 'bg-green-500 dark:bg-blue-400'
                    : activity.status === 'failure'
                    ? 'bg-red-500 dark:bg-red-400'
                    : 'bg-violet-500 dark:bg-cyan-400'
                }`}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activity.message}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
