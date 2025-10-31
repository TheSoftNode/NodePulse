import { NextResponse } from 'next/server';
import { seedDemoData, clearDemoData } from '@/lib/demo/seed-demo-data';

/**
 * POST /api/demo/seed
 * Seed the database with impressive demo data
 */
export async function POST() {
  try {
    const result = await seedDemoData();

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to seed demo data',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/demo/seed
 * Clear all demo data
 */
export async function DELETE() {
  try {
    await clearDemoData();

    return NextResponse.json({
      success: true,
      message: 'Demo data cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing demo data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear demo data',
      },
      { status: 500 }
    );
  }
}
