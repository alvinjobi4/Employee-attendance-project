import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// Default admin credentials
const DEFAULT_ADMIN = {
  email: 'admin@attendance.com',
  password: 'Admin@123',
};

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    if (!db.data?.admins) {
      db.data = db.data || { employees: [], attendance: [], leaves: [], admins: [] };
      db.data.admins = [];
    }

    // Check if admin already exists
    if (db.data.admins.some((a) => a.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const id = Date.now().toString();

    const newAdmin = {
      id,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.data.admins.push(newAdmin);
    await db.write();

    return NextResponse.json({
      message: 'Admin registered successfully',
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

// Initialize default admin if not exists
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();

    if (!db.data?.admins) {
      db.data = db.data || { employees: [], attendance: [], leaves: [], admins: [] };
      db.data.admins = [];
    }

    // Check if default admin exists
    const defaultAdminExists = db.data.admins.some((a) => a.email === DEFAULT_ADMIN.email);

    if (!defaultAdminExists) {
      const hashedPassword = await hashPassword(DEFAULT_ADMIN.password);
      const adminId = Date.now().toString();

      const defaultAdminData = {
        id: adminId,
        name: 'System Admin',
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.data.admins.push(defaultAdminData);
      await db.write();

      return NextResponse.json({
        message: 'Default admin created',
        credentials: {
          email: DEFAULT_ADMIN.email,
          password: DEFAULT_ADMIN.password,
        },
      });
    }

    return NextResponse.json({
      message: 'Admin already exists',
    });
  } catch (error) {
    console.error('Admin initialization error:', error);
    return NextResponse.json({ error: 'Initialization failed' }, { status: 500 });
  }
}
