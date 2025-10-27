import Link from 'next/link';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import Alert from '@/lib/db/models/Alert';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/stats-card';
import { NodeGrid } from '@/components/dashboard/node-grid';
import { AlertPanel } from '@/components/dashboard/alert-panel';
import { Server, CheckCircle2, AlertTriangle, Activity, Plus } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Monitor your DePIN infrastructure in real-time
          </p>
        </div>
        <Link href="/nodes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Node
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Nodes"
          value={totalNodes}
          description="Across all networks"
          icon={Server}
        />
        <StatsCard
          title="Healthy"
          value={healthyNodes}
          description="Operating normally"
          icon={CheckCircle2}
          className="border-green-200 dark:border-green-900"
        />
        <StatsCard
          title="Warning"
          value={warningNodes}
          description="Needs attention"
          icon={Activity}
          className="border-yellow-200 dark:border-yellow-900"
        />
        <StatsCard
          title="Critical"
          value={criticalNodes}
          description="Immediate action required"
          icon={AlertTriangle}
          className="border-red-200 dark:border-red-900"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Nodes Grid - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Your Nodes</h3>
            <p className="text-sm text-muted-foreground">
              {totalNodes === 0
                ? 'Get started by adding your first node'
                : `Monitoring ${totalNodes} node${totalNodes !== 1 ? 's' : ''}`}
            </p>
          </div>
          <NodeGrid nodes={serializedNodes} />
        </div>

        {/* Alerts Panel - Takes 1 column */}
        <div>
          <AlertPanel alerts={serializedAlerts} />
        </div>
      </div>
    </div>
  );
}
