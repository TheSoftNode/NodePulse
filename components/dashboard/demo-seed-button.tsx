'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function DemoSeedButton() {
  const [loading, setLoading] = useState(false);

  const handleSeedDemo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/demo/seed', { method: 'POST' });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error seeding demo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={handleSeedDemo}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading Demo...
        </>
      ) : (
        'Load Demo Data'
      )}
    </Button>
  );
}
