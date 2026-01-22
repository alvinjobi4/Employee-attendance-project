'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
}

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  percentage: number;
}

export default function DashboardPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const empData = localStorage.getItem('employee');
    if (!empData) {
      router.push('/');
      return;
    }

    const parsedEmployee = JSON.parse(empData);
    setEmployee(parsedEmployee);

    fetchAttendanceStats(parsedEmployee.id);
  }, [router]);

  const fetchAttendanceStats = async (employeeId: string) => {
    try {
      const response = await axios.get(`/api/attendance/${employeeId}`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employee');
    router.push('/');
  };

  if (loading || !employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const percentage = stats?.percentage || 0;
  const canTakeLeave = percentage >= 75;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {employee.name}</h1>
            <p className="text-gray-600">{employee.employeeId} - {employee.department}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium">Total Days</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalDays || 0}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium">Present</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats?.presentDays || 0}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium">Absent</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{stats?.absentDays || 0}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium">Half Days</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{stats?.halfDays || 0}</div>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Attendance Percentage</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="relative w-full bg-gray-200 rounded-full h-16 overflow-hidden">
                <div
                  className={`h-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-500 ${
                    percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage}%
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Minimum Required: 75%</p>
              <p className={`text-lg font-bold mt-1 ${canTakeLeave ? 'text-green-600' : 'text-red-600'}`}>
                {canTakeLeave ? 'Eligible for Leave' : 'Not Eligible for Leave'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/attendance"
            className="bg-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-600 transition text-center"
          >
            View Attendance Records
          </Link>
          <Link
            href={canTakeLeave ? '/leave' : '#'}
            className={`px-6 py-4 rounded-lg font-medium transition text-center ${
              canTakeLeave
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            onClick={(e) => !canTakeLeave && e.preventDefault()}
          >
            {canTakeLeave ? 'Request Leave' : 'Request Leave (Not Eligible)'}
          </Link>
        </div>
      </div>
    </div>
  );
}
