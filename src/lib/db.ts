import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  employeeId: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'leave';
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  admins?: Admin[];
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const dbPath = path.join(process.cwd(), 'public', 'db.json');
const defaultData: Database = {
  employees: [],
  attendance: [],
  leaves: [],
  admins: [],
};

let db: Low<Database> | null = null;

export const initializeDatabase = async () => {
  if (!db) {
    const adapter = new JSONFile<Database>(dbPath);
    db = new Low<Database>(adapter, defaultData);
    await db.read();
  }
  return db;
};

export const getDb = async () => {
  if (!db) {
    await initializeDatabase();
  }
  return db!;
};

export default initializeDatabase;
