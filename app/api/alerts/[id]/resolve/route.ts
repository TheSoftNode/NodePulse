import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { AlertService } from '@/lib/workers/AlertService';
import { isValidObjectId } from '@/lib/utils/validators';

/**
 * POST /api/alerts/[id]/resolve
 * Resolve an alert
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid alert ID' },
        { status: 400 }
      );
    }

    const alertService = new AlertService();
    await alertService.resolveAlert(id);

    return NextResponse.json({
      success: true,
      message: 'Alert resolved successfully',
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resolve alert' },
      { status: 500 }
    );
  }
}
