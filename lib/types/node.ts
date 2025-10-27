export type NetworkType = 'helium' | 'render' | 'arweave' | 'generic';

export type NodeStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface INode {
  _id: string;
  name: string;
  network: NetworkType;
  endpoint: string;
  checkInterval: number; // in seconds
  config: Record<string, any>;
  status: NodeStatus;
  lastChecked: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNodeInput {
  name: string;
  network: NetworkType;
  endpoint: string;
  checkInterval?: number;
  config?: Record<string, any>;
}

export interface UpdateNodeInput {
  name?: string;
  endpoint?: string;
  checkInterval?: number;
  config?: Record<string, any>;
}
