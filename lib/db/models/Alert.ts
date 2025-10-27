import mongoose, { Schema, Model } from 'mongoose';
import { IAlert, AlertType, AlertSeverity } from '@/lib/types/alert';

export interface IAlertDocument extends Omit<IAlert, '_id'>, mongoose.Document {}

const AlertSchema = new Schema<IAlertDocument>(
  {
    nodeId: {
      type: Schema.Types.ObjectId,
      ref: 'Node',
      required: true,
      index: true,
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
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    resolved: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
AlertSchema.index({ nodeId: 1, createdAt: -1 });
AlertSchema.index({ resolved: 1, createdAt: -1 });
AlertSchema.index({ severity: 1, resolved: 1 });

const Alert: Model<IAlertDocument> =
  mongoose.models.Alert || mongoose.model<IAlertDocument>('Alert', AlertSchema);

export default Alert;
