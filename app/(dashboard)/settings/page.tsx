import { PageHeader } from '@/components/layout/page-header';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your NodePulse instance"
      />

      <div className="text-center py-12">
        <p className="text-muted-foreground">Settings view coming soon</p>
      </div>
    </div>
  );
}
