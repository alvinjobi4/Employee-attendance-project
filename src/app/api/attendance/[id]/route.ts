import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { calculateAttendancePercentage, getAttendanceStats } from '@/lib/attendance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employeeId } = await params;
    const db = await getDb();

    const employee = db.data?.employees.find((e) => e.id === employeeId);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    const stats = getAttendanceStats(employeeId, db.data!);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: employeeId } = await params;
    const { date, status } = await request.json();

    if (!date || !status) {
      return NextResponse.json(
        { error: 'Date and status are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    const employee = db.data?.employees.find((e) => e.id === employeeId);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if attendance already exists for this date
    const existingRecord = db.data!.attendance.find(
      (a) => a.employeeId === employeeId && a.date === date
    );

    const id = existingRecord?.id || Date.now().toString();

    if (existingRecord) {
      existingRecord.status = status;
    } else {
      db.data!.attendance.push({
        id,
        employeeId,
        date,
        status,
        createdAt: new Date().toISOString(),
      });
    }

    await db.write();

    return NextResponse.json({
      message: 'Attendance recorded successfully',
      attendance: {
        id,
        employeeId,
        date,
        status,
      },
    });
  } catch (error) {
    console.error('Attendance record error:', error);
    return NextResponse.json(
      { error: 'Failed to record attendance' },
      { status: 500 }
    );
  }
}
