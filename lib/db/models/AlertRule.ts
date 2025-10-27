import mongoose, { Schema, Model } from 'mongoose';
import { IAlertRule, AlertType, AlertSeverity, AlertChannel } from '@/lib/types/alert';

export interface IAlertRuleDocument extends Omit<IAlertRule, '_id'>, mongoose.Document {}

const AlertRuleSchema = new Schema<IAlertRuleDocument>(
  {
    nodeId: {
      type: Schema.Types.ObjectId,
      ref: 'Node',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['node_down', 'high_resource', 'low_rewards', 'sync_issue', 'custom'] as AlertType[],
    },
    severity: {
      type: String,
      required: true,
      enum: ['info', 'warning', 'critical'] as AlertSeverity[],
    },
    condition: {
      duration: Number,
      threshold: Number,
      metric: {
        type: String,
        enum: ['cpu', 'memory', 'disk'],
      },
      minRewards: Number,
      timeWindow: Number,
      custom: {
        type: Map,
        of: Schema.Types.Mixed,
      },
    },
    channels: {
      type: [String],
      enum: ['discord', 'telegram', 'email', 'webhook'] as AlertChannel[],
      default: [],
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AlertRuleSchema.index({ nodeId: 1, enabled: 1 });
AlertRuleSchema.index({ type: 1 });

const AlertRule: Model<IAlertRuleDocument> =
  mongoose.models.AlertRule ||
  mongoose.model<IAlertRuleDocument>('AlertRule', AlertRuleSchema);

export default AlertRule;
