import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import HealthCheck from '@/lib/db/models/HealthCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NodeStatusBadge } from '@/components/nodes/node-status-badge';
import { NodeInsightsPanel } from '@/components/nodes/node-insights-panel';
import { ManualHealthCheckButton } from '@/components/nodes/manual-health-check-button';
import { isValidObjectId } from '@/lib/utils/validators';
import { formatRelativeTime } from '@/lib/utils/date-utils';
import { formatNetworkName, formatResponseTime } from '@/lib/utils/formatters';
import { ArrowLeft, Activity, Brain } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    notFound();
  }

  await connectDB();

  const node = await Node.findById(id).lean();

  if (!node) {
    notFound();
  }

  const healthChecks = await HealthCheck.find({ nodeId: id })
    .sort({ checkedAt: -1 })
    .limit(10)
    .lean();

  const successfulChecks = healthChecks.filter((hc) => hc.status === 'success').length;
  const uptime = healthChecks.length > 0 ? (successfulChecks / healthChecks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href="/nodes">
            <Button variant="ghost" size="icon" className="dark:hover:bg-slate-800 flex-shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">{node.name}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {formatNetworkName(node.network)} Node
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <NodeStatusBadge status={node.status} />
          <ManualHealthCheckButton nodeId={id} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{node.status}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last checked: {node.lastChecked ? formatRelativeTime(node.lastChecked) : 'Never'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on last {healthChecks.length} checks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthChecks.length > 0
                ? formatResponseTime(
                    healthChecks.reduce((acc, hc) => acc + hc.responseTime, 0) / healthChecks.length
                  )
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last {healthChecks.length} checks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-violet-600 dark:text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI-Powered Insights</h3>
        </div>
        <NodeInsightsPanel nodeId={id} />
      </div>

      {/* Node Details */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Endpoint</p>
              <p className="text-sm font-mono truncate text-slate-900 dark:text-slate-100">{node.endpoint}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Check Interval</p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{node.checkInterval}s</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Network</p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{formatNetworkName(node.network)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Created</p>
              <p className="text-sm text-slate-900 dark:text-slate-100">{formatRelativeTime(node.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Health Checks</CardTitle>
        </CardHeader>
        <CardContent>
          {healthChecks.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-8">
              No health checks yet. Click "Check Now" to run the first check.
            </p>
          ) : (
            <div className="space-y-2">
              {healthChecks.map((check) => (
                <div
                  key={check._id.toString()}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        check.status === 'success' ? 'bg-green-500 dark:bg-blue-400' : 'bg-red-500 dark:bg-red-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {check.status === 'success' ? 'Healthy' : 'Failed'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {formatRelativeTime(check.checkedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{formatResponseTime(check.responseTime)}</p>
                    {check.metrics.online !== undefined && (
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {check.metrics.online ? 'Online' : 'Offline'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
