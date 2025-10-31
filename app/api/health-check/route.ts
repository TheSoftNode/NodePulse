import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { HealthCheckWorker } from '@/lib/workers/HealthCheckWorker';
import { isValidObjectId } from '@/lib/utils/validators';

/**
 * POST /api/health-check
 * Trigger a manual health check for a specific node
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Handle both JSON and form data
    let nodeId: string;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const body = await request.json();
      nodeId = body.nodeId;
    } else {
      // Handle form data
      const formData = await request.formData();
      nodeId = formData.get('nodeId') as string;
    }

    if (!nodeId || !isValidObjectId(nodeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid node ID' },
        { status: 400 }
      );
    }

    const worker = new HealthCheckWorker();
    const result = await worker.triggerManualCheck(nodeId);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Health check completed',
    });
  } catch (error) {
    console.error('Error triggering health check:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to trigger health check',
      },
      { status: 500 }
    );
  }
}
