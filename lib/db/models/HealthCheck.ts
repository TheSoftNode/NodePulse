import mongoose, { Schema, Model, Types } from 'mongoose';
import { IHealthCheck, HealthCheckStatus } from '@/lib/types/health-check';

export interface IHealthCheckDocument extends Omit<IHealthCheck, '_id' | 'nodeId'>, mongoose.Document {
  nodeId: Types.ObjectId;
}

const HealthCheckSchema = new Schema<IHealthCheckDocument>(
  {
    nodeId: {
      type: Schema.Types.ObjectId,
      ref: 'Node',
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'failure'] as HealthCheckStatus[],
    },
    responseTime: {
      type: Number,
      required: true,
      min: 0,
    },
    metrics: {
      online: {
        type: Boolean,
        required: true,
      },
      syncStatus: String,
      diskSpace: Number,
      memoryUsage: Number,
      cpuUsage: Number,
      rewards: Number,
      blockHeight: Number,
      peerCount: Number,
      customMetrics: {
        type: Map,
        of: Schema.Types.Mixed,
      },
    },
    checkedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    error: String,
  },
  {
    timestamps: false, // We use checkedAt instead
  }
);

// Compound indexes for efficient queries
HealthCheckSchema.index({ nodeId: 1, checkedAt: -1 });
HealthCheckSchema.index({ status: 1, checkedAt: -1 });

// TTL index to automatically delete old health checks after 30 days
HealthCheckSchema.index({ checkedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const HealthCheck: Model<IHealthCheckDocument> =
  mongoose.models.HealthCheck ||
  mongoose.model<IHealthCheckDocument>('HealthCheck', HealthCheckSchema);

export default HealthCheck;
