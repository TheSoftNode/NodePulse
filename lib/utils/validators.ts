import { NetworkType } from '../types/node';
import { AlertType, AlertSeverity, AlertChannel } from '../types/alert';

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate HTTP/HTTPS URL
 */
export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate node endpoint based on network type
 */
export function validateEndpoint(endpoint: string, network: NetworkType): { valid: boolean; error?: string } {
  if (!endpoint || endpoint.trim() === '') {
    return { valid: false, error: 'Endpoint is required' };
  }

  if (!isValidHttpUrl(endpoint)) {
    return { valid: false, error: 'Invalid URL format. Must start with http:// or https://' };
  }

  return { valid: true };
}

/**
 * Validate node name
 */
export function validateNodeName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Node name is required' };
  }

  if (name.length < 3) {
    return { valid: false, error: 'Node name must be at least 3 characters' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'Node name must be less than 100 characters' };
  }

  return { valid: true };
}

/**
 * Validate check interval
 */
export function validateCheckInterval(interval: number): { valid: boolean; error?: string } {
  if (interval < 60) {
    return { valid: false, error: 'Check interval must be at least 60 seconds' };
  }

  if (interval > 86400) {
    return { valid: false, error: 'Check interval must be less than 24 hours (86400 seconds)' };
  }

  return { valid: true };
}

/**
 * Validate network type
 */
export function isValidNetworkType(network: string): network is NetworkType {
  return ['helium', 'render', 'arweave', 'generic'].includes(network);
}

/**
 * Validate alert type
 */
export function isValidAlertType(type: string): type is AlertType {
  return ['node_down', 'high_resource', 'low_rewards', 'sync_issue', 'custom'].includes(type);
}

/**
 * Validate alert severity
 */
export function isValidAlertSeverity(severity: string): severity is AlertSeverity {
  return ['info', 'warning', 'critical'].includes(severity);
}

/**
 * Validate alert channel
 */
export function isValidAlertChannel(channel: string): channel is AlertChannel {
  return ['discord', 'telegram', 'email', 'webhook'].includes(channel);
}

/**
 * Validate MongoDB ObjectId format
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Discord webhook URL
 */
export function isValidDiscordWebhook(url: string): boolean {
  return url.startsWith('https://discord.com/api/webhooks/') || url.startsWith('https://discordapp.com/api/webhooks/');
}

/**
 * Validate Telegram bot token format
 */
export function isValidTelegramToken(token: string): boolean {
  return /^\d+:[A-Za-z0-9_-]+$/.test(token);
}
