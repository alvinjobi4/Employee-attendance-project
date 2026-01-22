import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { calculateAttendancePercentage, canEmployeeTakeLeave } from '@/lib/attendance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employeeId } = await params;
    const db = await getDb();

    const leaves = db.data?.leaves.filter((l) => l.employeeId === employeeId) || [];

    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Leave fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaves' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employeeId } = await params;
    const { startDate, endDate, reason } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const employee = db.data?.employees.find((e) => e.id === employeeId);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check attendance percentage
    const attendancePercentage = calculateAttendancePercentage(employeeId, db.data!);

    if (!canEmployeeTakeLeave(attendancePercentage)) {
      return NextResponse.json(
        {
          error: `Attendance percentage is ${attendancePercentage}%. You need at least 75% to take leave.`,
          currentPercentage: attendancePercentage,
        },
        { status: 403 }
      );
    }

    const id = Date.now().toString();
    const newLeave = {
      id,
      employeeId,
      startDate,
      endDate,
      reason: reason || '',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.data) {
      db.data = { employees: [], attendance: [], leaves: [] };
    }

    db.data.leaves.push(newLeave);
    await db.write();

    return NextResponse.json({
      message: 'Leave request submitted successfully',
      leave: newLeave,
    });
  } catch (error) {
    console.error('Leave request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit leave request' },
      { status: 500 }
    );
  }
}
