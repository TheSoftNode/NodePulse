import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import HealthCheck from '@/lib/db/models/HealthCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NodeStatusBadge } from '@/components/nodes/node-status-badge';
import { isValidObjectId } from '@/lib/utils/validators';
import { formatRelativeTime } from '@/lib/utils/date-utils';
import { formatNetworkName, formatResponseTime } from '@/lib/utils/formatters';
import { ArrowLeft, Activity, RefreshCw } from 'lucide-react';

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/nodes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{node.name}</h2>
            <p className="text-muted-foreground mt-1">
              {formatNetworkName(node.network)} Node
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NodeStatusBadge status={node.status} />
          <form action={`/api/health-check`} method="POST">
            <input type="hidden" name="nodeId" value={id} />
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Now
            </Button>
          </form>
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

      {/* Node Details */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Endpoint</p>
              <p className="text-sm font-mono truncate">{node.endpoint}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Check Interval</p>
              <p className="text-sm">{node.checkInterval}s</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Network</p>
              <p className="text-sm">{formatNetworkName(node.network)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm">{formatRelativeTime(node.createdAt)}</p>
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No health checks yet. Click "Check Now" to run the first check.
            </p>
          ) : (
            <div className="space-y-2">
              {healthChecks.map((check) => (
                <div
                  key={check._id.toString()}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        check.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {check.status === 'success' ? 'Healthy' : 'Failed'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(check.checkedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatResponseTime(check.responseTime)}</p>
                    {check.metrics.online !== undefined && (
                      <p className="text-xs text-muted-foreground">
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
