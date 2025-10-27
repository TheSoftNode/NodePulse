export type HealthCheckStatus = 'success' | 'failure';

export interface HealthMetrics {
  online: boolean;
  syncStatus?: string;
  diskSpace?: number; // percentage
  memoryUsage?: number; // percentage
  cpuUsage?: number; // percentage
  rewards?: number;
  blockHeight?: number;
  peerCount?: number;
  customMetrics?: Record<string, any>;
}

export interface IHealthCheck {
  _id: string;
  nodeId: string;
  status: HealthCheckStatus;
  responseTime: number; // in milliseconds
  metrics: HealthMetrics;
  checkedAt: Date;
  error?: string;
}

export interface HealthCheckResult {
  nodeId: string;
  status: HealthCheckStatus;
  responseTime: number;
  metrics: HealthMetrics;
  checkedAt: Date;
  error?: string;
}

export interface HealthData {
  online: boolean;
  metrics: HealthMetrics;
}
