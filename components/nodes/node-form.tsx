'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NetworkType } from '@/lib/types/node';
import { toast } from 'sonner';

export function NodeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    network: 'generic' as NetworkType,
    endpoint: '',
    checkInterval: 300,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Node added successfully!');
        router.push('/');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to add node');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Node Configuration</CardTitle>
        <CardDescription>
          Enter the details of the node you want to monitor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Node Name
            </label>
            <Input
              id="name"
              placeholder="e.g., My Helium Hotspot"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="network" className="text-sm font-medium">
              Network Type
            </label>
            <select
              id="network"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.network}
              onChange={(e) => setFormData({ ...formData, network: e.target.value as NetworkType })}
            >
              <option value="helium">Helium</option>
              <option value="render">Render</option>
              <option value="arweave">Arweave</option>
              <option value="generic">Generic HTTP</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="endpoint" className="text-sm font-medium">
              Endpoint URL
            </label>
            <Input
              id="endpoint"
              type="url"
              placeholder="https://your-node-endpoint.com"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              The HTTP/HTTPS URL where your node API is accessible
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="checkInterval" className="text-sm font-medium">
              Check Interval (seconds)
            </label>
            <Input
              id="checkInterval"
              type="number"
              min="60"
              max="86400"
              value={formData.checkInterval}
              onChange={(e) => setFormData({ ...formData, checkInterval: parseInt(e.target.value) })}
              required
            />
            <p className="text-xs text-muted-foreground">
              How often to check node health (minimum 60 seconds)
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Node'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
