import { AttendanceRecord, Database } from './db';

export const calculateAttendancePercentage = (
  employeeId: string,
  data: Database
): number => {
  const employeeAttendance = data.attendance.filter(
    (a) => a.employeeId === employeeId
  );

  if (employeeAttendance.length === 0) return 100;

  const presentDays = employeeAttendance.filter(
    (a) => a.status === 'present' || a.status === 'half-day'
  ).length;

  // Count half-days as 0.5
  const adjustedPresent =
    employeeAttendance.filter((a) => a.status === 'present').length +
    employeeAttendance.filter((a) => a.status === 'half-day').length * 0.5;

  const totalDays = employeeAttendance.length;

  return Math.round((adjustedPresent / totalDays) * 100);
};

export const getEmployeeLeaveDays = (
  employeeId: string,
  data: Database,
  dateRange?: { startDate: string; endDate: string }
): number => {
  let leaves = data.leaves.filter(
    (l) => l.employeeId === employeeId && l.status === 'approved'
  );

  if (dateRange) {
    leaves = leaves.filter(
      (l) =>
        new Date(l.startDate) >= new Date(dateRange.startDate) &&
        new Date(l.endDate) <= new Date(dateRange.endDate)
    );
  }

  let totalDays = 0;
  leaves.forEach((leave) => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    totalDays += days + 1; // Include both start and end date
  });

  return totalDays;
};

export const canEmployeeTakeLeave = (
  attendancePercentage: number
): boolean => {
  return attendancePercentage >= 75;
};

export const getAttendanceStats = (
  employeeId: string,
  data: Database
): {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  percentage: number;
} => {
  const employeeAttendance = data.attendance.filter(
    (a) => a.employeeId === employeeId
  );

  const presentDays = employeeAttendance.filter(
    (a) => a.status === 'present'
  ).length;
  const absentDays = employeeAttendance.filter(
    (a) => a.status === 'absent'
  ).length;
  const halfDays = employeeAttendance.filter(
    (a) => a.status === 'half-day'
  ).length;
  const totalDays = employeeAttendance.length;
  const percentage = calculateAttendancePercentage(employeeId, data);

  return {
    totalDays,
    presentDays,
    absentDays,
    halfDays,
    percentage,
  };
};
