import { BaseAdapter } from './BaseAdapter';
import { INode } from '@/lib/types/node';
import { HealthData } from '@/lib/types/health-check';

/**
 * Render network adapter
 * Checks Render node health
 */
export class RenderAdapter extends BaseAdapter {
  async checkHealth(node: INode): Promise<HealthData> {
    try {
      // Check node status endpoint
      const response = await this.fetchWithTimeout(`${node.endpoint}/status`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract Render-specific metrics
      const metrics: HealthData['metrics'] = {
        online: data.status === 'active' || data.status === 'running',
        syncStatus: data.sync_state || (data.synced ? 'synced' : 'syncing'),
        blockHeight: data.block_height || data.latest_block,
        peerCount: data.peers || data.peer_count,
        cpuUsage: data.cpu_usage,
        memoryUsage: data.memory_usage,
        diskSpace: data.disk_usage,
        customMetrics: {
          version: data.version,
          network: data.network,
          uptime: data.uptime,
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
            error: error instanceof Error ? error.message : 'Failed to connect to Render node',
          },
        },
      };
    }
  }

  validateConfig(config: Record<string, any>): { valid: boolean; error?: string } {
    // Render nodes may require specific configuration
    return { valid: true };
  }
}
