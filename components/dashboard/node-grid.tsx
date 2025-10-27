import { INode } from '@/lib/types/node';
import { NodeCard } from '@/components/nodes/node-card';

interface NodeGridProps {
  nodes: INode[];
}

export function NodeGrid({ nodes }: NodeGridProps) {
  if (nodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No nodes configured yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first node to start monitoring.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {nodes.map((node) => (
        <NodeCard key={node._id} node={node} />
      ))}
    </div>
  );
}
