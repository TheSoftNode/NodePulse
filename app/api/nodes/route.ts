import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Node from '@/lib/db/models/Node';
import { CreateNodeInput } from '@/lib/types/node';
import { validateNodeName, validateEndpoint, validateCheckInterval } from '@/lib/utils/validators';

/**
 * GET /api/nodes
 * Fetch all nodes
 */
export async function GET() {
  try {
    await connectDB();

    const nodes = await Node.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: nodes,
    });
  } catch (error) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch nodes',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/nodes
 * Create a new node
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: CreateNodeInput = await request.json();

    // Validate input
    const nameValidation = validateNodeName(body.name);
    if (!nameValidation.valid) {
      return NextResponse.json(
        { success: false, error: nameValidation.error },
        { status: 400 }
      );
    }

    const endpointValidation = validateEndpoint(body.endpoint, body.network);
    if (!endpointValidation.valid) {
      return NextResponse.json(
        { success: false, error: endpointValidation.error },
        { status: 400 }
      );
    }

    if (body.checkInterval) {
      const intervalValidation = validateCheckInterval(body.checkInterval);
      if (!intervalValidation.valid) {
        return NextResponse.json(
          { success: false, error: intervalValidation.error },
          { status: 400 }
        );
      }
    }

    // Create node
    const node = await Node.create({
      name: body.name,
      network: body.network,
      endpoint: body.endpoint,
      checkInterval: body.checkInterval || 300,
      config: body.config || {},
      status: 'unknown',
    });

    return NextResponse.json(
      {
        success: true,
        data: node,
        message: 'Node created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create node',
      },
      { status: 500 }
    );
  }
}
