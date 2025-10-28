import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import HealthCheck from '@/lib/db/models/HealthCheck';
import { UpdateNodeInput } from '@/lib/types/node';
import { isValidObjectId } from '@/lib/utils/validators';

/**
 * GET /api/nodes/[id]
 * Get a single node by ID
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

    const node = await Node.findById(id);

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: node,
    });
  } catch (error) {
    console.error('Error fetching node:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch node' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/nodes/[id]
 * Update a node
 */
export async function PUT(
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

    const body: UpdateNodeInput = await request.json();

    const node = await Node.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: node,
      message: 'Node updated successfully',
    });
  } catch (error) {
    console.error('Error updating node:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update node' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/nodes/[id]
 * Delete a node
 */
export async function DELETE(
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

    const node = await Node.findByIdAndDelete(id);

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    // Also delete related health checks
    await HealthCheck.deleteMany({ nodeId: id });

    return NextResponse.json({
      success: true,
      message: 'Node deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting node:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete node' },
      { status: 500 }
    );
  }
}
