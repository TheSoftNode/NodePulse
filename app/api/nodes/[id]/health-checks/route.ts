import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import HealthCheck from '@/lib/db/models/HealthCheck';
import { isValidObjectId } from '@/lib/utils/validators';

/**
 * GET /api/nodes/[id]/health-checks
 * Get health checks for a specific node
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid node ID' },
        { status: 400 }
      );
    }

    const healthChecks = await HealthCheck.find({ nodeId: id })
      .sort({ checkedAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: healthChecks,
    });
  } catch (error) {
    console.error('Error fetching health checks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch health checks' },
      { status: 500 }
    );
  }
}
