import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import HealthCheck from '@/lib/db/models/HealthCheck';
import Alert from '@/lib/db/models/Alert';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';
import { TrendingUp, Activity, AlertTriangle, Server } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  await connectDB();

  // Get statistics for the last 24 hours
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalNodes,
    totalHealthChecks24h,
    totalHealthChecks7d,
    successfulChecks24h,
    failedChecks24h,
    totalAlerts24h,
    totalAlerts7d,
    nodesByNetwork,
    nodesByStatus,
    healthCheckTimeSeries,
  ] = await Promise.all([
    Node.countDocuments(),
    HealthCheck.countDocuments({ checkedAt: { $gte: last24Hours } }),
    HealthCheck.countDocuments({ checkedAt: { $gte: last7Days } }),
    HealthCheck.countDocuments({ checkedAt: { $gte: last24Hours }, status: 'success' }),
    HealthCheck.countDocuments({ checkedAt: { $gte: last24Hours }, status: 'failure' }),
    Alert.countDocuments({ createdAt: { $gte: last24Hours } }),
    Alert.countDocuments({ createdAt: { $gte: last7Days } }),
    Node.aggregate([
      { $group: { _id: '$network', count: { $sum: 1 } } },
    ]),
    Node.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    HealthCheck.aggregate([
      {
        $match: { checkedAt: { $gte: last7Days } }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$checkedAt' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]),
  ]);

  const successRate24h = totalHealthChecks24h > 0
    ? ((successfulChecks24h / totalHealthChecks24h) * 100).toFixed(1)
    : '0';

  const avgChecksPerNode24h = totalNodes > 0
    ? (totalHealthChecks24h / totalNodes).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          View historical data and performance trends across your infrastructure
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalHealthChecks24h}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Health Checks (24h)</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Avg {avgChecksPerNode24h} per node
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-green-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-blue-950">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-green-600 dark:text-blue-400">{successRate24h}%</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Success Rate</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              {successfulChecks24h} passed, {failedChecks24h} failed
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">{totalAlerts24h}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Alerts (24h)</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Triggered in last day
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-cyan-950">
              <Server className="h-6 w-6 text-violet-600 dark:text-cyan-400" />
            </div>
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalNodes}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Nodes</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Currently monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Transform data for charts */}
      {(() => {
        // Process time series data
        const dateMap = new Map<string, { success: number; failure: number }>();

        healthCheckTimeSeries.forEach((item: any) => {
          const date = item._id.date;
          const status = item._id.status;
          const count = item.count;

          if (!dateMap.has(date)) {
            dateMap.set(date, { success: 0, failure: 0 });
          }

          const entry = dateMap.get(date)!;
          if (status === 'success') {
            entry.success = count;
          } else if (status === 'failure') {
            entry.failure = count;
          }
        });

        const timeSeriesData = Array.from(dateMap.entries())
          .map(([date, data]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            success: data.success,
            failure: data.failure,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Process network data
        const networkData = nodesByNetwork.map((item: any) => ({
          name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
          value: item.count,
        }));

        // Process status data
        const statusData = nodesByStatus.map((item: any) => ({
          name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
          value: item.count,
        }));

        return (
          <AnalyticsCharts
            timeSeriesData={timeSeriesData}
            networkData={networkData}
            statusData={statusData}
          />
        );
      })()}
    </div>
  );
}
