import Link from 'next/link';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import Alert from '@/lib/db/models/Alert';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/stats-card';
import { NodeGrid } from '@/components/dashboard/node-grid';
import { AlertPanel } from '@/components/dashboard/alert-panel';
import { LiveActivityFeed } from '@/components/dashboard/live-activity-feed';
import { DemoSeedButton } from '@/components/dashboard/demo-seed-button';
import { Server, CheckCircle2, AlertTriangle, Activity, Plus, Zap } from 'lucide-react';
import { INode } from '@/lib/types/node';
import { IAlert } from '@/lib/types/alert';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await connectDB();

  // Fetch nodes and alerts
  const nodes = await Node.find({}).sort({ createdAt: -1 }).lean();
  const unresolvedAlerts = await Alert.find({ resolved: false })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Calculate stats
  const totalNodes = nodes.length;
  const healthyNodes = nodes.filter((n) => n.status === 'healthy').length;
  const warningNodes = nodes.filter((n) => n.status === 'warning').length;
  const criticalNodes = nodes.filter((n) => n.status === 'critical').length;

  // Convert Mongoose documents to plain objects
  const serializedNodes: INode[] = nodes.map((node) => ({
    _id: node._id.toString(),
    name: node.name,
    network: node.network,
    endpoint: node.endpoint,
    checkInterval: node.checkInterval,
    config: (node.config || {}) as Record<string, unknown>,
    status: node.status,
    lastChecked: node.lastChecked ? new Date(node.lastChecked) : null,
    createdAt: new Date(node.createdAt),
    updatedAt: new Date(node.updatedAt),
  }));

  const serializedAlerts: IAlert[] = unresolvedAlerts.map((alert) => ({
    _id: alert._id.toString(),
    nodeId: alert.nodeId.toString(),
    type: alert.type,
    severity: alert.severity,
    message: alert.message,
    resolved: alert.resolved,
    createdAt: new Date(alert.createdAt),
    resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt) : undefined,
    metadata: (alert.metadata || undefined) as Record<string, unknown> | undefined,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Monitor your DePIN infrastructure in real-time
            </p>
          </div>
          <Link href="/nodes/new">
            <Button className="bg-green-600 dark:bg-blue-600 hover:bg-green-700 dark:hover:bg-blue-700 text-white shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Server className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalNodes}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Nodes</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Across all networks</p>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 dark:border-blue-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-blue-950">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-green-600 dark:text-blue-400">{healthyNodes}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Healthy</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Operating normally</p>
            </div>
          </div>

          <div className="rounded-xl border border-violet-200 dark:border-cyan-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-cyan-950">
                <Activity className="h-6 w-6 text-violet-600 dark:text-cyan-400" />
              </div>
              <span className="text-3xl font-bold text-violet-600 dark:text-cyan-400">{warningNodes}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Warning</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Needs attention</p>
            </div>
          </div>

          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">{criticalNodes}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Critical</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Immediate action required</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Nodes Grid - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Your Nodes</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {totalNodes === 0
                    ? 'Get started by adding your first node'
                    : `Monitoring ${totalNodes} node${totalNodes !== 1 ? 's' : ''}`}
                </p>
              </div>
              <NodeGrid nodes={serializedNodes} />
            </div>
          </div>

          {/* Right Sidebar - Alerts and Live Activity */}
          <div className="space-y-6">
            <AlertPanel alerts={serializedAlerts} />
            <LiveActivityFeed />
          </div>
        </div>

        {/* Quick Actions Banner */}
        {totalNodes === 0 && (
          <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm">
            <div className="text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-blue-950 mx-auto">
                <Zap className="h-8 w-8 text-green-600 dark:text-blue-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Ready to start monitoring?</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Add your first node to begin tracking health, performance, and uptime across your DePIN infrastructure.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/nodes/new">
                  <Button size="lg" className="bg-green-600 dark:bg-blue-600 hover:bg-green-700 dark:hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Node
                  </Button>
                </Link>
                <DemoSeedButton />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
