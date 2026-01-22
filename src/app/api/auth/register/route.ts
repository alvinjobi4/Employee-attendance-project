import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, employeeId, department } =
      await request.json();

    if (!name || !email || !password || !employeeId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if employee already exists
    if (db.data?.employees.some((e) => e.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    if (db.data?.employees.some((e) => e.employeeId === employeeId)) {
      return NextResponse.json(
        { error: 'Employee ID already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const id = Date.now().toString();

    const newEmployee = {
      id,
      name,
      email,
      password: hashedPassword,
      employeeId,
      department: department || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.data) {
      db.data = { employees: [], attendance: [], leaves: [] };
    }

    db.data.employees.push(newEmployee);
    await db.write();

    return NextResponse.json({
      message: 'Employee registered successfully',
      employee: {
        id: newEmployee.id,
        name: newEmployee.name,
        email: newEmployee.email,
        employeeId: newEmployee.employeeId,
        department: newEmployee.department,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
