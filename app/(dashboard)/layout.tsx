import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import connectDB from '@/lib/db/connection';
import Alert from '@/lib/db/models/Alert';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let notifications: Array<{
    _id: string;
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    createdAt: Date;
    nodeId: string;
  }> = [];

  try {
    await connectDB();

    // Fetch recent unresolved alerts for notifications
    const recentAlerts = await Alert.find({ resolved: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    notifications = recentAlerts.map((alert) => ({
      _id: alert._id.toString(),
      type: alert.type,
      severity: alert.severity as 'info' | 'warning' | 'critical',
      message: alert.message,
      createdAt: new Date(alert.createdAt),
      nodeId: alert.nodeId.toString(),
    }));
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    // Continue with empty notifications during build
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header notifications={notifications} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
