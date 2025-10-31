import { INode } from '@/lib/types/node';
import { NodeCard } from '@/components/nodes/node-card';

interface NodeGridProps {
  nodes: INode[];
}

export function NodeGrid({ nodes }: NodeGridProps) {
  if (nodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">No nodes configured yet.</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
          Add your first node to start monitoring.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {nodes.map((node) => (
        <NodeCard key={node._id} node={node} />
      ))}
    </div>
  );
}
