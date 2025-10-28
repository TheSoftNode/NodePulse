import { BaseAdapter } from './adapters/BaseAdapter';
import { HeliumAdapter } from './adapters/HeliumAdapter';
import { RenderAdapter } from './adapters/RenderAdapter';
import { ArweaveAdapter } from './adapters/ArweaveAdapter';
import { GenericHttpAdapter } from './adapters/GenericHttpAdapter';
import { INode, NetworkType } from '@/lib/types/node';
import { HealthCheckResult } from '@/lib/types/health-check';
import { determineNodeStatus } from '@/lib/utils/status-helpers';
import Node from '@/lib/db/models/Node';
import HealthCheck from '@/lib/db/models/HealthCheck';
import { AlertService } from './AlertService';

export class HealthCheckWorker {
  private adapters: Map<NetworkType, BaseAdapter>;
  private alertService: AlertService;

  constructor() {
    this.adapters = new Map([
      ['helium', new HeliumAdapter()],
      ['render', new RenderAdapter()],
      ['arweave', new ArweaveAdapter()],
      ['generic', new GenericHttpAdapter()],
    ]);

    this.alertService = new AlertService();
  }

  async executeScheduledChecks(): Promise<HealthCheckResult[]> {
    try {
      const nodes = await Node.find({}).lean();
      const results: HealthCheckResult[] = [];

      console.log(`Starting health checks for ${nodes.length} nodes...`);

      for (const node of nodes) {
        const serializedNode: INode = {
          _id: node._id.toString(),
          name: node.name,
          network: node.network,
          endpoint: node.endpoint,
          checkInterval: node.checkInterval,
          config: node.config,
          status: node.status,
          lastChecked: node.lastChecked ? new Date(node.lastChecked) : null,
          createdAt: new Date(node.createdAt),
          updatedAt: new Date(node.updatedAt),
        };

        if (this.shouldCheckNode(serializedNode)) {
          const result = await this.checkSingleNode(serializedNode);
          results.push(result);
          await this.processCheckResult(serializedNode, result);
        }
      }

      console.log(`Completed ${results.length} health checks`);
      return results;
    } catch (error) {
      console.error('Error executing scheduled checks:', error);
      throw error;
    }
  }

  private shouldCheckNode(node: INode): boolean {
    if (!node.lastChecked) {
      return true;
    }

    const now = new Date();
    const lastCheck = new Date(node.lastChecked);
    const timeSinceLastCheck = (now.getTime() - lastCheck.getTime()) / 1000;

    return timeSinceLastCheck >= node.checkInterval;
  }

  async checkSingleNode(node: INode): Promise<HealthCheckResult> {
    const adapter = this.adapters.get(node.network);
    if (!adapter) {
      throw new Error(`No adapter found for network: ${node.network}`);
    }

    const startTime = Date.now();

    try {
      console.log(`Checking node: ${node.name} (${node.network})`);

      const healthData = await adapter.checkHealth(node);
      const responseTime = Date.now() - startTime;
      const status = healthData.online ? 'success' : 'failure';

      return {
        nodeId: node._id.toString(),
        status,
        responseTime,
        metrics: healthData.metrics,
        checkedAt: new Date(),
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`Health check failed for ${node.name}:`, error);

      return {
        nodeId: node._id.toString(),
        status: 'failure',
        responseTime,
        metrics: {
          online: false,
          customMetrics: {
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        },
        checkedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async processCheckResult(node: INode, result: HealthCheckResult): Promise<void> {
    try {
      await HealthCheck.create({
        nodeId: result.nodeId,
        status: result.status,
        responseTime: result.responseTime,
        metrics: result.metrics,
        checkedAt: result.checkedAt,
        error: result.error,
      });

      const newStatus = determineNodeStatus(result.metrics, result.responseTime);
      const oldStatus = node.status;

      await Node.findByIdAndUpdate(result.nodeId, {
        status: newStatus,
        lastChecked: result.checkedAt,
      });

      if (oldStatus !== newStatus) {
        console.log(`Node ${node.name} status changed: ${oldStatus} -> ${newStatus}`);
        await this.alertService.processNodeStatusChange(result.nodeId, oldStatus, newStatus, result.metrics);
      }
    } catch (error) {
      console.error('Error processing check result:', error);
    }
  }

  async triggerManualCheck(nodeId: string): Promise<HealthCheckResult> {
    try {
      const nodeDoc = await Node.findById(nodeId).lean();
      if (!nodeDoc) {
        throw new Error('Node not found');
      }

      const node: INode = {
        _id: nodeDoc._id.toString(),
        name: nodeDoc.name,
        network: nodeDoc.network,
        endpoint: nodeDoc.endpoint,
        checkInterval: nodeDoc.checkInterval,
        config: nodeDoc.config,
        status: nodeDoc.status,
        lastChecked: nodeDoc.lastChecked ? new Date(nodeDoc.lastChecked) : null,
        createdAt: new Date(nodeDoc.createdAt),
        updatedAt: new Date(nodeDoc.updatedAt),
      };

      const result = await this.checkSingleNode(node);
      await this.processCheckResult(node, result);

      return result;
    } catch (error) {
      console.error('Error triggering manual check:', error);
      throw error;
    }
  }
}
