import mongoose, { Schema, Model } from 'mongoose';
import { INode, NetworkType, NodeStatus } from '@/lib/types/node';

export interface INodeDocument extends Omit<INode, '_id'>, mongoose.Document {}

const NodeSchema = new Schema<INodeDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    network: {
      type: String,
      required: true,
      enum: ['helium', 'render', 'arweave', 'generic'] as NetworkType[],
    },
    endpoint: {
      type: String,
      required: true,
      trim: true,
    },
    checkInterval: {
      type: Number,
      required: true,
      default: 300, // 5 minutes
      min: 60, // minimum 1 minute
    },
    config: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['healthy', 'warning', 'critical', 'unknown'] as NodeStatus[],
      default: 'unknown',
    },
    lastChecked: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
NodeSchema.index({ status: 1, lastChecked: -1 });
NodeSchema.index({ network: 1 });
NodeSchema.index({ createdAt: -1 });

// Prevent model recompilation in development
const Node: Model<INodeDocument> =
  mongoose.models.Node || mongoose.model<INodeDocument>('Node', NodeSchema);

export default Node;
