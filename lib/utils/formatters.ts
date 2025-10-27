/**
 * Format milliseconds to human-readable time
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format uptime percentage
 */
export function formatUptime(successCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((successCount / totalCount) * 100 * 10) / 10;
}

/**
 * Format network name for display
 */
export function formatNetworkName(network: string): string {
  const networkNames: Record<string, string> = {
    helium: 'Helium',
    render: 'Render',
    arweave: 'Arweave',
    generic: 'Generic',
  };
  return networkNames[network] || network;
}

/**
 * Format node status for display
 */
export function formatStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    healthy: 'Healthy',
    warning: 'Warning',
    critical: 'Critical',
    unknown: 'Unknown',
  };
  return statusMap[status] || status;
}

/**
 * Format alert severity
 */
export function formatSeverity(severity: string): string {
  const severityMap: Record<string, string> = {
    info: 'Info',
    warning: 'Warning',
    critical: 'Critical',
  };
  return severityMap[severity] || severity;
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
