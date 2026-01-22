import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const leaves = db.data?.leaves || [];
    const employees = db.data?.employees || [];

    // Enrich leave requests with employee info
    const enrichedLeaves = leaves.map((leave) => {
      const employee = employees.find((e) => e.id === leave.employeeId);
      return {
        ...leave,
        employeeName: employee?.name || 'Unknown',
        employeeEmail: employee?.email || 'Unknown',
        employeeId: employee?.employeeId || 'Unknown',
      };
    });

    // Sort by date (newest first)
    enrichedLeaves.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(enrichedLeaves);
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

    // Return the leave with employee info
    const employee = db.data?.employees.find((e) => e.id === leave.employeeId);

    return NextResponse.json({
      message: `Leave ${status} successfully`,
      leave: {
        ...leave,
        employeeName: employee?.name || 'Unknown',
        employeeEmail: employee?.email || 'Unknown',
      },
    });
  } catch (error) {
    console.error('Leave update error:', error);
    return NextResponse.json(
      { error: 'Failed to update leave status' },
      { status: 500 }
    );
  }
}
