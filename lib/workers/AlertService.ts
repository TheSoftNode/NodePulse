import { NodeStatus } from '@/lib/types/node';
import { HealthMetrics } from '@/lib/types/health-check';
import { AlertType, AlertSeverity, AlertChannel } from '@/lib/types/alert';
import Alert from '@/lib/db/models/Alert';
import AlertRule from '@/lib/db/models/AlertRule';
import Node from '@/lib/db/models/Node';

/**
 * Alert Service
 * Handles alert creation, evaluation, and notification
 */
export class AlertService {
  /**
   * Process node status change and create alerts if needed
   */
  async processNodeStatusChange(
    nodeId: string,
    oldStatus: NodeStatus,
    newStatus: NodeStatus,
    metrics: HealthMetrics
  ): Promise<void> {
    try {
      // Fetch alert rules for this node
      const rules = await AlertRule.find({
        nodeId,
        enabled: true,
      });

      if (rules.length === 0) {
        return;
      }

      const node = await Node.findById(nodeId);
      if (!node) return;

      // Evaluate each rule
      for (const rule of rules) {
        const shouldAlert = this.evaluateRule(rule, oldStatus, newStatus, metrics);

        if (shouldAlert) {
          await this.createAlert(nodeId, rule.type, rule.severity, node.name, metrics);
          await this.sendNotifications(rule.channels, node.name, rule.type, rule.severity, metrics);
        }
      }
    } catch (error) {
      console.error('L Error processing node status change:', error);
    }
  }

  /**
   * Evaluate if an alert rule should trigger
   */
  private evaluateRule(
    rule: any,
    oldStatus: NodeStatus,
    newStatus: NodeStatus,
    metrics: HealthMetrics
  ): boolean {
    switch (rule.type) {
      case 'node_down':
        return !metrics.online;

      case 'high_resource':
        if (!rule.condition.metric || !rule.condition.threshold) return false;

        const value = this.getMetricValue(metrics, rule.condition.metric);
        if (value === undefined) return false;

        return value >= rule.condition.threshold;

      case 'low_rewards':
        if (!rule.condition.minRewards) return false;
        return (metrics.rewards || 0) < rule.condition.minRewards;

      case 'sync_issue':
        return metrics.syncStatus !== 'synced';

      default:
        return false;
    }
  }

  /**
   * Get metric value by name
   */
  private getMetricValue(metrics: HealthMetrics, metricName: string): number | undefined {
    switch (metricName) {
      case 'cpu':
        return metrics.cpuUsage;
      case 'memory':
        return metrics.memoryUsage;
      case 'disk':
        return metrics.diskSpace;
      default:
        return undefined;
    }
  }

  /**
   * Create an alert in the database
   */
  private async createAlert(
    nodeId: string,
    type: AlertType,
    severity: AlertSeverity,
    nodeName: string,
    metrics: HealthMetrics
  ): Promise<void> {
    try {
      const message = this.generateAlertMessage(type, nodeName, metrics);

      await Alert.create({
        nodeId,
        type,
        severity,
        message,
        resolved: false,
        metadata: {
          metrics,
        },
      });

      console.log(`=¨ Alert created: ${message}`);
    } catch (error) {
      console.error('L Error creating alert:', error);
    }
  }

  /**
   * Generate alert message based on type
   */
  private generateAlertMessage(type: AlertType, nodeName: string, metrics: HealthMetrics): string {
    switch (type) {
      case 'node_down':
        return `Node "${nodeName}" is offline`;

      case 'high_resource':
        const resources = [];
        if (metrics.cpuUsage && metrics.cpuUsage >= 85) {
          resources.push(`CPU: ${metrics.cpuUsage.toFixed(1)}%`);
        }
        if (metrics.memoryUsage && metrics.memoryUsage >= 85) {
          resources.push(`Memory: ${metrics.memoryUsage.toFixed(1)}%`);
        }
        if (metrics.diskSpace && metrics.diskSpace >= 85) {
          resources.push(`Disk: ${metrics.diskSpace.toFixed(1)}%`);
        }
        return `Node "${nodeName}" has high resource usage: ${resources.join(', ')}`;

      case 'low_rewards':
        return `Node "${nodeName}" has low rewards: ${metrics.rewards || 0}`;

      case 'sync_issue':
        return `Node "${nodeName}" is not synced: ${metrics.syncStatus || 'unknown'}`;

      default:
        return `Alert for node "${nodeName}"`;
    }
  }

  /**
   * Send notifications through configured channels
   */
  private async sendNotifications(
    channels: AlertChannel[],
    nodeName: string,
    type: AlertType,
    severity: AlertSeverity,
    metrics: HealthMetrics
  ): Promise<void> {
    const message = this.generateAlertMessage(type, nodeName, metrics);

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'discord':
            await this.sendDiscordNotification(message, severity);
            break;
          case 'telegram':
            await this.sendTelegramNotification(message, severity);
            break;
          case 'email':
            await this.sendEmailNotification(message, severity);
            break;
          case 'webhook':
            await this.sendWebhookNotification(message, severity, metrics);
            break;
        }
      } catch (error) {
        console.error(`L Error sending ${channel} notification:`, error);
      }
    }
  }

  /**
   * Send Discord webhook notification
   */
  private async sendDiscordNotification(message: string, severity: AlertSeverity): Promise<void> {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const color = severity === 'critical' ? 15158332 : severity === 'warning' ? 16776960 : 3447003;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title: '=¨ NodePulse Alert',
            description: message,
            color,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    console.log('=ì Discord notification sent');
  }

  /**
   * Send Telegram notification
   */
  private async sendTelegramNotification(message: string, severity: AlertSeverity): Promise<void> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return;

    const emoji = severity === 'critical' ? '=4' : severity === 'warning' ? '=á' : '9';

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `${emoji} *NodePulse Alert*\n\n${message}`,
        parse_mode: 'Markdown',
      }),
    });

    console.log('=ì Telegram notification sent');
  }

  /**
   * Send email notification (placeholder)
   */
  private async sendEmailNotification(message: string, severity: AlertSeverity): Promise<void> {
    // TODO: Implement email notification using SMTP or email service
    console.log('=ç Email notification (not implemented):', message);
  }

  /**
   * Send webhook notification
   */
  private async sendWebhookNotification(
    message: string,
    severity: AlertSeverity,
    metrics: HealthMetrics
  ): Promise<void> {
    const webhookUrl = process.env.CUSTOM_WEBHOOK_URL;
    if (!webhookUrl) return;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        severity,
        metrics,
        timestamp: new Date().toISOString(),
      }),
    });

    console.log('=ì Webhook notification sent');
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(alertId: string): Promise<void> {
    try {
      await Alert.findByIdAndUpdate(alertId, {
        resolved: true,
        resolvedAt: new Date(),
      });

      console.log(` Alert ${alertId} resolved`);
    } catch (error) {
      console.error('L Error resolving alert:', error);
      throw error;
    }
  }
}
