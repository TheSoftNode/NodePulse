import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connection';
import HealthCheck from '@/lib/db/models/HealthCheck';

export const dynamic = 'force-dynamic';

/**
 * GET /api/sse/updates
 * Server-Sent Events endpoint for real-time updates
 */
export async function GET(request: NextRequest) {
  await connectDB();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`)
      );

      // Set up interval to check for new health checks
      const intervalId = setInterval(async () => {
        try {
          // Get latest health checks from last 30 seconds
          const recentChecks = await HealthCheck.find({
            checkedAt: { $gte: new Date(Date.now() - 30000) }
          })
            .sort({ checkedAt: -1 })
            .limit(10)
            .lean();

          if (recentChecks.length > 0) {
            const data = {
              type: 'health_check_update',
              checks: recentChecks.map(check => ({
                _id: check._id.toString(),
                nodeId: check.nodeId.toString(),
                status: check.status,
                responseTime: check.responseTime,
                metrics: check.metrics,
                checkedAt: check.checkedAt,
              })),
              timestamp: new Date(),
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          }

          // Send keep-alive ping
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch (error) {
          console.error('SSE error:', error);
        }
      }, 5000); // Check every 5 seconds

      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
