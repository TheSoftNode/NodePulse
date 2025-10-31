'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ManualHealthCheckButtonProps {
  nodeId: string;
}

export function ManualHealthCheckButton({ nodeId }: ManualHealthCheckButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleHealthCheck = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/health-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeId }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the page to show updated data
        router.refresh();
      } else {
        console.error('Health check failed:', data.error);
        alert('Health check failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error triggering health check:', error);
      alert('Failed to trigger health check. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleHealthCheck}
      disabled={isLoading}
      className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Checking...' : 'Check Now'}
    </Button>
  );
}
