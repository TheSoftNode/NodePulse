import { BaseAdapter } from './BaseAdapter';
import { INode } from '@/lib/types/node';
import { HealthData } from '@/lib/types/health-check';

/**
 * Arweave network adapter
 * Checks Arweave node health
 */
export class ArweaveAdapter extends BaseAdapter {
  async checkHealth(node: INode): Promise<HealthData> {
    try {
      // Arweave info endpoint
      const response = await this.fetchWithTimeout(`${node.endpoint}/info`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract Arweave-specific metrics
      const metrics: HealthData['metrics'] = {
        online: true,
        blockHeight: data.height || data.blocks,
        peerCount: data.peers,
        diskSpace: this.calculateDiskUsage(data.disk_space, data.disk_space_total),
        customMetrics: {
          network: data.network,
          version: data.release,
          weaveSize: data.weave_size,
          wallets: data.wallets,
          queueLength: data.queue_length,
          nodeState: data.node_state,
        },
      };

      return {
        online: true,
        metrics,
      };
    } catch (error) {
      return {
        online: false,
        metrics: {
          online: false,
          customMetrics: {
            error: error instanceof Error ? error.message : 'Failed to connect to Arweave node',
          },
        },
      };
    }
  }

  /**
   * Calculate disk usage percentage
   */
  private calculateDiskUsage(used?: number, total?: number): number | undefined {
    if (!used || !total) return undefined;
    return Math.round((used / total) * 100);
  }

  validateConfig(config: Record<string, any>): { valid: boolean; error?: string } {
    return { valid: true };
  }
}
