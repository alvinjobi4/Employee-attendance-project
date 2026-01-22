# Employee Attendance and Leave Management System

A comprehensive web-based application for managing employee attendance and leave requests.

## Features

- **Employee Registration & Login**: Secure authentication with JWT tokens
- **Admin Portal**: Separate admin login with full employee management
- **Attendance Tracking**: Record and view daily attendance status
- **Attendance Percentage**: Automatically calculated based on attendance records
- **Leave Management**: Request leaves with 75% minimum attendance requirement
- **Admin Leave Approval**: Admins can approve/reject leave requests in real-time
- **Employee Database**: Complete employee information management
- **Dashboard**: Quick overview of attendance stats and leave status
- **Real-time Updates**: Leave status updates visible to both admins and employees

## Tech Stack

- **Frontend**: Next.js 16+ with React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: JSON file-based with lowdb
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── employees/route.ts
│   │   │   └── leaves/route.ts
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── attendance/
│   │   │   ├── [id]/route.ts
│   │   │   └── records/route.ts
│   │   ├── employees/route.ts
│   │   └── leaves/
│   │       ├── [id]/route.ts
│   │       └── manage/route.ts
│   ├── admin/
│   │   ├── login/page.tsx (Admin Login)
│   │   ├── dashboard/page.tsx (Admin Dashboard)
│   │   └── leaves/page.tsx (Admin Leave Management)
│   ├── page.tsx (Employee Login Page)
│   ├── register/page.tsx (Employee Registration)
│   ├── dashboard/page.tsx (Employee Dashboard)
│   ├── attendance/page.tsx (Attendance Records)
│   └── leave/page.tsx (Leave Management)
├── lib/
│   ├── auth.ts (Authentication utilities)
│   ├── attendance.ts (Attendance calculation logic)
│   └── db.ts (Database management)
```

## Installation & Setup

### Prerequisites
- Node.js 18.17 or higher
- npm or yarn

### Steps

1. **Navigate to project directory**:
   ```bash
   cd C:\employee-attendance-system
   ```

2. **Install dependencies** (already installed):
   ```bash
   npm install
   ```

3. **Environment Setup**:
   The `.env.local` file is already configured with:
   - `DATABASE_URL`: JSON file path
   - `JWT_SECRET`: Secret for token generation
   - `NEXT_PUBLIC_API_URL`: API endpoint

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Usage

### Employee Registration
1. Click "Register here" on the login page
2. Fill in your details (Name, Email, Employee ID, Department)
3. Set a password
4. Submit to create your account

### Employee Login
1. Enter your registered email and password
2. Click "Login"
3. You'll be redirected to your dashboard

### Admin Login
1. Click "Admin Login" on the main login page
2. Use default credentials:
   - Email: `admin@attendance.com`
   - Password: `Admin@123`
3. You'll be redirected to the admin dashboard

### Employee Dashboard
- See your attendance percentage
- View total days, present, absent, and half-day records
- Check if you're eligible for leave (75% minimum attendance)
- Access leave requests and attendance records

### Admin Dashboard
- View all employees with their attendance statistics
- See employee count by attendance level
- Monitor all leave requests
- Filter employees by name or ID
- Quick access to leave management

### Admin Leave Management
- View all employee leave requests
- Filter by status (All, Pending, Approved, Rejected)
- Approve or reject pending leave requests
- See employee details for each request
- Real-time updates as requests are processed

### Request Leave (Employee)
- Click "Request Leave" on the dashboard (requires 75%+ attendance)
- Provide start date, end date, and reason
- Submit the request
- Status updates automatically when admin approves/rejects

### View Attendance Records
- Click "View Attendance Records" to see all your attendance history
- Records show date, status, and when it was recorded

## API Endpoints

### Admin Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register new admin
- `GET /api/admin/register` - Initialize default admin

### Admin Operations
- `GET /api/admin/employees` - Get all employees with stats
- `GET /api/admin/leaves` - Get all leave requests
- `PATCH /api/admin/leaves` - Approve/reject leave request

### Employee Authentication
- `POST /api/auth/register` - Register new employee
- `POST /api/auth/login` - Login employee

### Employee Attendance
- `GET /api/attendance/[id]` - Get attendance stats for employee
- `POST /api/attendance/[id]` - Record attendance
- `GET /api/attendance/records` - Get attendance records

### Employee Leaves
- `GET /api/leaves/[id]` - Get leave requests for employee
- `POST /api/leaves/[id]` - Submit new leave request
- `GET /api/leaves/manage` - Get all leave requests (admin)
- `PATCH /api/leaves/manage` - Update leave status (admin)

### Employees
- `GET /api/employees` - Get all employees with stats

## Business Rules

1. **Attendance Percentage Calculation**:
   - Based on present and half-day records
   - Full day present = 1 day
   - Half-day present = 0.5 days

2. **Leave Eligibility**:
   - Employees must have at least 75% attendance to request leave
   - Leave requests start in "pending" status
   - Approved leaves reduce the attendance records

3. **Attendance Status**:
   - `present`: Full day present
   - `absent`: Full day absent
   - `half-day`: Half day present
   - `leave`: On approved leave

## Default Test Data

You can add test data by making API requests:

```bash
# Initialize default admin (run once)
curl -X GET http://localhost:3000/api/admin/register

# Register an employee
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "employeeId": "EMP001",
    "department": "IT"
  }'

# Login as admin
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@attendance.com",
    "password": "Admin@123"
  }'
```

### Default Admin Credentials
- **Email**: `admin@attendance.com`
- **Password**: `Admin@123`
- *Automatically created on first load*

## Future Enhancements

- Admin dashboard for leave management
- Email notifications
- Holiday calendar integration
- Attendance reports and analytics
- Mobile app support
- Database migration to PostgreSQL/MongoDB
- Two-factor authentication

## License

MIT

## Support

For issues or questions, please contact the development team.
