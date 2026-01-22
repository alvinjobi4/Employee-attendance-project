import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status');
    const db = await getDb();

    let leaves = db.data?.leaves || [];

    if (status) {
      leaves = leaves.filter((l) => l.status === status);
    }

    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Leaves fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaves' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { leaveId, status } = await request.json();

    if (!leaveId || !status) {
      return NextResponse.json(
        { error: 'Leave ID and status are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const leave = db.data?.leaves.find((l) => l.id === leaveId);

    if (!leave) {
      return NextResponse.json({ error: 'Leave not found' }, { status: 404 });
    }

    leave.status = status;
    leave.updatedAt = new Date().toISOString();

    await db.write();

    return NextResponse.json({
      message: 'Leave status updated successfully',
      leave,
    });
  } catch (error) {
    console.error('Leave update error:', error);
    return NextResponse.json(
      { error: 'Failed to update leave status' },
      { status: 500 }
    );
  }
}
