import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NodeStatusBadge } from './node-status-badge';
import { INode } from '@/lib/types/node';
import { formatRelativeTime } from '@/lib/utils/date-utils';
import { formatNetworkName } from '@/lib/utils/formatters';
import { Server } from 'lucide-react';

interface NodeCardProps {
  node: INode;
}

export function NodeCard({ node }: NodeCardProps) {
  return (
    <Link href={`/nodes/${node._id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Server className="h-4 w-4" />
            {node.name}
          </CardTitle>
          <NodeStatusBadge status={node.status} showIcon={false} />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Network: <span className="font-medium">{formatNetworkName(node.network)}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Last checked:{' '}
              <span className="font-medium">
                {node.lastChecked ? formatRelativeTime(node.lastChecked) : 'Never'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
