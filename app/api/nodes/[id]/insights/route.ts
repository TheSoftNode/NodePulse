import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import { NetworkBenchmarkService } from '@/lib/services/NetworkBenchmarkService';
import { EarningsOptimizer } from '@/lib/services/EarningsOptimizer';
import { PredictiveAnalytics } from '@/lib/services/PredictiveAnalytics';
import { isValidObjectId } from '@/lib/utils/validators';

/**
 * GET /api/nodes/[id]/insights
 * Get AI-powered insights for a node
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid node ID' },
        { status: 400 }
      );
    }

    const nodeDoc = await Node.findById(id).lean();

    if (!nodeDoc) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    const node = {
      _id: nodeDoc._id.toString(),
      name: nodeDoc.name,
      network: nodeDoc.network,
      endpoint: nodeDoc.endpoint,
      checkInterval: nodeDoc.checkInterval,
      config: nodeDoc.config,
      status: nodeDoc.status,
      lastChecked: nodeDoc.lastChecked ? new Date(nodeDoc.lastChecked) : null,
      createdAt: new Date(nodeDoc.createdAt),
      updatedAt: new Date(nodeDoc.updatedAt),
    };

    // Initialize services
    const benchmarkService = new NetworkBenchmarkService();
    const earningsOptimizer = new EarningsOptimizer();
    const predictiveAnalytics = new PredictiveAnalytics();

    // Get all insights in parallel
    const [
      healthScore,
      earningsOptimization,
      roiComparison,
      predictiveAlert,
      performanceTrends,
      anomalyScore,
    ] = await Promise.all([
      benchmarkService.calculateHealthScore(node),
      earningsOptimizer.analyzeEarnings(node),
      earningsOptimizer.compareROI(node),
      predictiveAnalytics.predictFailure(node),
      predictiveAnalytics.getPerformanceTrends(id),
      predictiveAnalytics.getAnomalyScore(id),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        healthScore,
        earningsOptimization,
        roiComparison,
        predictiveAlert,
        performanceTrends,
        anomalyScore,
      },
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch insights',
      },
      { status: 500 }
    );
  }
}
