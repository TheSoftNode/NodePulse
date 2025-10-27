import { NodeStatus } from '../types/node';
import { AlertSeverity } from '../types/alert';
import { HealthMetrics } from '../types/health-check';

/**
 * Determine node status based on health metrics
 */
export function determineNodeStatus(metrics: HealthMetrics, responseTime: number): NodeStatus {
  // Node is offline
  if (!metrics.online) {
    return 'critical';
  }

  // Check resource usage thresholds
  const criticalThresholds = {
    cpu: 95,
    memory: 95,
    disk: 95,
  };

  const warningThresholds = {
    cpu: 85,
    memory: 85,
    disk: 85,
  };

  // Critical resource usage
  if (
    (metrics.cpuUsage && metrics.cpuUsage >= criticalThresholds.cpu) ||
    (metrics.memoryUsage && metrics.memoryUsage >= criticalThresholds.memory) ||
    (metrics.diskSpace && metrics.diskSpace >= criticalThresholds.disk)
  ) {
    return 'critical';
  }

  // Warning resource usage
  if (
    (metrics.cpuUsage && metrics.cpuUsage >= warningThresholds.cpu) ||
    (metrics.memoryUsage && metrics.memoryUsage >= warningThresholds.memory) ||
    (metrics.diskSpace && metrics.diskSpace >= warningThresholds.disk)
  ) {
    return 'warning';
  }

  // High response time (warning)
  if (responseTime > 5000) {
    // > 5 seconds
    return 'warning';
  }

  // All checks passed
  return 'healthy';
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: NodeStatus): string {
  const colors: Record<NodeStatus, string> = {
    healthy: 'green',
    warning: 'yellow',
    critical: 'red',
    unknown: 'gray',
  };

  return colors[status];
}

/**
 * Get status variant for badges
 */
export function getStatusVariant(status: NodeStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<NodeStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    healthy: 'default',
    warning: 'secondary',
    critical: 'destructive',
    unknown: 'outline',
  };

  return variants[status];
}

/**
 * Get severity color for UI
 */
export function getSeverityColor(severity: AlertSeverity): string {
  const colors: Record<AlertSeverity, string> = {
    info: 'blue',
    warning: 'yellow',
    critical: 'red',
  };

  return colors[severity];
}

/**
 * Get severity variant for badges
 */
export function getSeverityVariant(severity: AlertSeverity): 'default' | 'secondary' | 'destructive' {
  const variants: Record<AlertSeverity, 'default' | 'secondary' | 'destructive'> = {
    info: 'default',
    warning: 'secondary',
    critical: 'destructive',
  };

  return variants[severity];
}

/**
 * Check if node needs immediate attention
 */
export function needsAttention(status: NodeStatus): boolean {
  return status === 'critical' || status === 'warning';
}

/**
 * Get status icon emoji
 */
export function getStatusIcon(status: NodeStatus): string {
  const icons: Record<NodeStatus, string> = {
    healthy: '🟢',
    warning: '🟡',
    critical: '🔴',
    unknown: '⚪',
  };

  return icons[status];
}

/**
 * Get severity icon emoji
 */
export function getSeverityIcon(severity: AlertSeverity): string {
  const icons: Record<AlertSeverity, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    critical: '🚨',
  };

  return icons[severity];
}

/**
 * Calculate overall health score (0-100)
 */
export function calculateHealthScore(metrics: HealthMetrics): number {
  if (!metrics.online) return 0;

  let score = 100;

  // Deduct points for high resource usage
  if (metrics.cpuUsage) {
    score -= Math.max(0, (metrics.cpuUsage - 70) * 0.5);
  }

  if (metrics.memoryUsage) {
    score -= Math.max(0, (metrics.memoryUsage - 70) * 0.5);
  }

  if (metrics.diskSpace) {
    score -= Math.max(0, (metrics.diskSpace - 70) * 0.5);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
