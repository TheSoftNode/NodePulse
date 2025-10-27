import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No active alerts. All systems operational!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Recent Alerts
          <Badge variant="destructive" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <Link
              key={alert._id}
              href={`/alerts/${alert._id}`}
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getSeverityIcon(alert.severity)}</span>
                    <Badge variant={getSeverityVariant(alert.severity)} className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium truncate">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(alert.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {alerts.length > 5 && (
            <Link
              href="/alerts"
              className="text-sm text-primary hover:underline block text-center pt-2"
            >
              View all {alerts.length} alerts →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
