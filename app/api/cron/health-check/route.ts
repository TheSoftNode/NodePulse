import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { HealthCheckWorker } from '@/lib/workers/HealthCheckWorker';

/**
 * POST /api/cron/health-check
 * Trigger automated health checks for all nodes
 * This endpoint should be called by a cron job (e.g., every 5 minutes)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const worker = new HealthCheckWorker();
    const results = await worker.executeScheduledChecks();

    return NextResponse.json({
      success: true,
      data: {
        checked: results.length,
        timestamp: new Date().toISOString(),
      },
      message: `Successfully checked ${results.length} nodes`,
    });
  } catch (error) {
    console.error('Error in cron health check:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute health checks',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/health-check
 * Health check for the cron endpoint itself
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Cron health check endpoint is operational',
    timestamp: new Date().toISOString(),
  });
}
