import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Alert from '@/lib/db/models/Alert';

/**
 * GET /api/alerts
 * Fetch alerts with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    const nodeId = searchParams.get('nodeId');
    const severity = searchParams.get('severity');

    const query: any = {};

    if (resolved !== null) {
      query.resolved = resolved === 'true';
    }

    if (nodeId) {
      query.nodeId = nodeId;
    }

    if (severity) {
      query.severity = severity;
    }

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .populate('nodeId', 'name network')
      .limit(100);

    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
