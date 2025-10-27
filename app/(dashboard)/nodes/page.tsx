import Link from 'next/link';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { NodeGrid } from '@/components/dashboard/node-grid';
import { Plus } from 'lucide-react';
import { INode } from '@/lib/types/node';

export const dynamic = 'force-dynamic';

export default async function NodesPage() {
  await connectDB();

  const nodes = await Node.find({}).sort({ createdAt: -1 }).lean();

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nodes"
        description={`${nodes.length} node${nodes.length !== 1 ? 's' : ''} configured`}
        actions={
          <Link href="/nodes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Node
            </Button>
          </Link>
        }
      />

      <NodeGrid nodes={serializedNodes} />
    </div>
  );
}
