import { Badge } from '@/components/ui/badge';
import { NodeStatus } from '@/lib/types/node';
import { getStatusVariant, getStatusIcon } from '@/lib/utils/status-helpers';

interface NodeStatusBadgeProps {
  status: NodeStatus;
  showIcon?: boolean;
}

export function NodeStatusBadge({ status, showIcon = true }: NodeStatusBadgeProps) {
  const variant = getStatusVariant(status);
  const icon = getStatusIcon(status);

  return (
    <Badge variant={variant}>
      {showIcon && <span className="mr-1">{icon}</span>}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
