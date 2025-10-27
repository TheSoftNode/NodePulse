import { BaseAdapter } from './BaseAdapter';
import { INode } from '@/lib/types/node';
import { HealthData } from '@/lib/types/health-check';

/**
 * Generic HTTP adapter for custom blockchain nodes
 * Simply checks if the endpoint is reachable
 */
export class GenericHttpAdapter extends BaseAdapter {
  async checkHealth(node: INode): Promise<HealthData> {
    try {
      const response = await this.fetchWithTimeout(node.endpoint);

      const online = response.ok;
      let metrics: HealthData['metrics'] = {
        online,
      };

      // Try to parse JSON response if available
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        try {
          const data = await response.json();
          metrics = {
            online: true,
            ...this.parseCommonMetrics(data),
            customMetrics: data,
          };
        } catch {
          // If JSON parsing fails, just return online status
        }
      }

      return {
        online,
        metrics,
      };
    } catch (error) {
      return {
        online: false,
        metrics: {
          online: false,
          customMetrics: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      };
    }
  }
}
