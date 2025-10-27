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

/**
 * Health Check Worker
 * Responsible for executing health checks on nodes
 */
export class HealthCheckWorker {
  private adapters: Map<NetworkType, BaseAdapter>;
  private alertService: AlertService;

  constructor() {
    // Initialize network adapters
    this.adapters = new Map([
      ['helium', new HeliumAdapter()],
      ['render', new RenderAdapter()],
      ['arweave', new ArweaveAdapter()],
      ['generic', new GenericHttpAdapter()],
    ]);

    this.alertService = new AlertService();
  }

  /**
   * Execute scheduled health checks for all active nodes
   */
  async executeScheduledChecks(): Promise<HealthCheckResult[]> {
    try {
      const nodes = await Node.find({});
      const results: HealthCheckResult[] = [];

      console.log(`= Starting health checks for ${nodes.length} nodes...`);

      for (const node of nodes) {
        if (this.shouldCheckNode(node)) {
          const result = await this.checkSingleNode(node);
          results.push(result);
          await this.processCheckResult(node, result);
        }
      }

      console.log(` Completed ${results.length} health checks`);
      return results;
    } catch (error) {
      console.error('L Error executing scheduled checks:', error);
      throw error;
    }
  }

  /**
   * Check if a node should be checked based on its check interval
   */
  private shouldCheckNode(node: any): boolean {
    if (!node.lastChecked) {
      return true; // Never checked before
    }

    const now = new Date();
    const lastCheck = new Date(node.lastChecked);
    const timeSinceLastCheck = (now.getTime() - lastCheck.getTime()) / 1000; // in seconds

    return timeSinceLastCheck >= node.checkInterval;
  }

  /**
   * Perform health check on a single node
   */
  async checkSingleNode(node: INode): Promise<HealthCheckResult> {
    const adapter = this.adapters.get(node.network);
    if (!adapter) {
      throw new Error(`No adapter found for network: ${node.network}`);
    }

    const startTime = Date.now();

    try {
      console.log(`= Checking node: ${node.name} (${node.network})`);

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
      console.error(`L Health check failed for ${node.name}:`, error);

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

  /**
   * Process the result of a health check
   */
  private async processCheckResult(node: any, result: HealthCheckResult): Promise<void> {
    try {
      // Save health check to database
      await HealthCheck.create({
        nodeId: result.nodeId,
        status: result.status,
        responseTime: result.responseTime,
        metrics: result.metrics,
        checkedAt: result.checkedAt,
        error: result.error,
      });

      // Determine new node status
      const newStatus = determineNodeStatus(result.metrics, result.responseTime);
      const oldStatus = node.status;

      // Update node status and last checked time
      await Node.findByIdAndUpdate(result.nodeId, {
        status: newStatus,
        lastChecked: result.checkedAt,
      });

      // Process alerts if status changed
      if (oldStatus !== newStatus) {
        console.log(`=Ê Node ${node.name} status changed: ${oldStatus} ’ ${newStatus}`);
        await this.alertService.processNodeStatusChange(result.nodeId, oldStatus, newStatus, result.metrics);
      }
    } catch (error) {
      console.error('L Error processing check result:', error);
    }
  }

  /**
   * Trigger a manual health check for a specific node
   */
  async triggerManualCheck(nodeId: string): Promise<HealthCheckResult> {
    try {
      const node = await Node.findById(nodeId);
      if (!node) {
        throw new Error('Node not found');
      }

      const result = await this.checkSingleNode(node as any);
      await this.processCheckResult(node, result);

      return result;
    } catch (error) {
      console.error('L Error triggering manual check:', error);
      throw error;
    }
  }
}
