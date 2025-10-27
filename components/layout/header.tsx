'use client';

import { Bell, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title?: string;
  unresolvedAlerts?: number;
}

export function Header({ title = 'Dashboard', unresolvedAlerts = 0 }: HeaderProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Alerts indicator */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unresolvedAlerts > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
            >
              {unresolvedAlerts}
            </Badge>
          )}
        </Button>

        {/* Refresh button */}
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
