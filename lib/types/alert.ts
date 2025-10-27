export type AlertType = 'node_down' | 'high_resource' | 'low_rewards' | 'sync_issue' | 'custom';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type AlertChannel = 'discord' | 'telegram' | 'email' | 'webhook';

export interface IAlert {
  _id: string;
  nodeId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export interface IAlertRule {
  _id: string;
  nodeId: string;
  name: string;
  type: AlertType;
  severity: AlertSeverity;
  condition: AlertCondition;
  channels: AlertChannel[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertCondition {
  // For node_down alerts
  duration?: number; // seconds the node must be down before alerting

  // For resource alerts
  threshold?: number; // percentage threshold (e.g., 90 for 90% CPU)
  metric?: 'cpu' | 'memory' | 'disk';

  // For reward alerts
  minRewards?: number;
  timeWindow?: number; // seconds

  // Custom conditions
  custom?: Record<string, any>;
}

export interface CreateAlertRuleInput {
  nodeId: string;
  name: string;
  type: AlertType;
  severity: AlertSeverity;
  condition: AlertCondition;
  channels: AlertChannel[];
  enabled?: boolean;
}

export interface UpdateAlertRuleInput {
  name?: string;
  severity?: AlertSeverity;
  condition?: AlertCondition;
  channels?: AlertChannel[];
  enabled?: boolean;
}
