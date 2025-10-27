import { BaseAdapter } from './BaseAdapter';
import { INode } from '@/lib/types/node';
import { HealthData } from '@/lib/types/health-check';

/**
 * Helium network adapter
 * Checks Helium hotspot/node health
 */
export class HeliumAdapter extends BaseAdapter {
  async checkHealth(node: INode): Promise<HealthData> {
    try {
      // Check node health endpoint
      const response = await this.fetchWithTimeout(`${node.endpoint}/health`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract Helium-specific metrics
      const metrics: HealthData['metrics'] = {
        online: data.online || data.status === 'online' || response.ok,
        syncStatus: data.sync_status || data.synced ? 'synced' : 'syncing',
        blockHeight: data.block_height || data.height,
        peerCount: data.peer_count || data.connections,
        rewards: data.rewards || data.earnings,
        customMetrics: {
          hotspotName: data.name,
          listenAddresses: data.listen_addresses,
          region: data.region,
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
            error: error instanceof Error ? error.message : 'Failed to connect to Helium node',
          },
        },
      };
    }
  }

  validateConfig(config: Record<string, any>): { valid: boolean; error?: string } {
    // Helium nodes may require API keys or specific configuration
    // Add validation as needed
    return { valid: true };
  }
}
