import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAttendanceStats } from '@/lib/attendance';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const employees = db.data?.employees || [];

    // Get stats for each employee
    const employeesWithStats = employees.map((emp) => {
      const stats = getAttendanceStats(emp.id, db.data!);
      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        employeeId: emp.employeeId,
        department: emp.department,
        attendancePercentage: stats.percentage,
        totalDays: stats.totalDays,
        presentDays: stats.presentDays,
        absentDays: stats.absentDays,
        halfDays: stats.halfDays,
        createdAt: emp.createdAt,
      };
    });

    return NextResponse.json(employeesWithStats);
  } catch (error) {
    console.error('Employees fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}
