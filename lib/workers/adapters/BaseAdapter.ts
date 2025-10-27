import { INode } from '@/lib/types/node';
import { HealthData } from '@/lib/types/health-check';

/**
 * Base adapter class that all network adapters must extend
 */
export abstract class BaseAdapter {
  /**
   * Perform health check on a node
   * @param node - The node to check
   * @returns Health data including metrics
   */
  abstract checkHealth(node: INode): Promise<HealthData>;

  /**
   * Validate node configuration
   * @param config - Node configuration object
   * @returns Validation result
   */
  validateConfig(config: Record<string, any>): { valid: boolean; error?: string } {
    // Default implementation - can be overridden by specific adapters
    return { valid: true };
  }

  /**
   * Helper method to make HTTP requests with timeout
   */
  protected async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  /**
   * Parse common metrics from response
   */
  protected parseCommonMetrics(data: any): Partial<HealthData['metrics']> {
    return {
      syncStatus: data.sync_status || data.syncStatus,
      blockHeight: data.block_height || data.blockHeight || data.height,
      peerCount: data.peer_count || data.peerCount || data.peers?.length,
    };
  }
}
