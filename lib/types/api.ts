import { INode } from './node';
import { IHealthCheck } from './health-check';
import { IAlert, IAlertRule } from './alert';

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Node API responses
export interface NodesResponse extends ApiResponse<INode[]> {}
export interface NodeResponse extends ApiResponse<INode> {}
export interface NodeWithHealthChecks extends INode {
  recentHealthChecks: IHealthCheck[];
  uptime?: number;
}

// Health Check API responses
export interface HealthChecksResponse extends ApiResponse<IHealthCheck[]> {}
export interface HealthCheckResponse extends ApiResponse<IHealthCheck> {}
export interface TriggerHealthCheckResponse extends ApiResponse<{
  nodeId: string;
  triggered: boolean;
}> {}

// Alert API responses
export interface AlertsResponse extends ApiResponse<IAlert[]> {}
export interface AlertResponse extends ApiResponse<IAlert> {}
export interface AlertRulesResponse extends ApiResponse<IAlertRule[]> {}
export interface AlertRuleResponse extends ApiResponse<IAlertRule> {}

// Dashboard stats
export interface DashboardStats {
  totalNodes: number;
  healthyNodes: number;
  warningNodes: number;
  criticalNodes: number;
  unresolvedAlerts: number;
  averageUptime: number;
  averageResponseTime: number;
}

export interface DashboardResponse extends ApiResponse<{
  stats: DashboardStats;
  nodes: INode[];
  recentAlerts: IAlert[];
}> {}

// SSE Event types
export interface SSEEvent {
  type: 'health_check' | 'alert' | 'node_update' | 'connected';
  data?: any;
}

export interface HealthCheckSSEEvent extends SSEEvent {
  type: 'health_check';
  data: {
    nodeId: string;
    status: 'success' | 'failure';
    timestamp: string;
  };
}

export interface AlertSSEEvent extends SSEEvent {
  type: 'alert';
  data: {
    alertId: string;
    nodeId: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
  };
}

// System health
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: boolean;
    [key: string]: boolean;
  };
}
