import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import mongoose from 'mongoose';

/**
 * GET /api/health
 * System health check endpoint
 */
export async function GET() {
  try {
    // Check database connection
    await connectDB();
    const dbStatus = mongoose.connection.readyState === 1;

    const status = dbStatus ? 'healthy' : 'degraded';

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: dbStatus,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
