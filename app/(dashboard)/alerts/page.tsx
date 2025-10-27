import connectDB from '@/lib/db/connection';
import Alert from '@/lib/db/models/Alert';
import { PageHeader } from '@/components/layout/page-header';
import { IAlert } from '@/lib/types/alert';

export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  await connectDB();

  const alerts = await Alert.find({}).sort({ createdAt: -1 }).limit(50).lean();

  const serializedAlerts: IAlert[] = alerts.map((alert) => ({
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
      <PageHeader
        title="Alerts"
        description={`${alerts.length} alert${alerts.length !== 1 ? 's' : ''} total`}
      />

      <div className="text-center py-12">
        <p className="text-muted-foreground">Alert list view coming soon</p>
      </div>
    </div>
  );
}
