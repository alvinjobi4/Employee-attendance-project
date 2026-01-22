'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-purple-100 p-3 rounded-full">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Admin Portal</h1>
        <p className="text-gray-600 mb-6 text-center">Attendance Management System</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowDefaults(!showDefaults)}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            {showDefaults ? 'Hide' : 'Show'} Default Credentials
          </button>

          {showDefaults && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
              <p className="text-gray-700 font-medium mb-2">Default Admin Credentials:</p>
              <p className="text-gray-600">Email: <code className="bg-white px-2 py-1 rounded">admin@attendance.com</code></p>
              <p className="text-gray-600">Password: <code className="bg-white px-2 py-1 rounded">Admin@123</code></p>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link href="/admin/register" className="text-purple-600 hover:underline font-medium">
            Register as Admin
          </Link>
        </p>

        <p className="text-center text-gray-600 mt-4">
          Employee?{' '}
          <Link href="/" className="text-purple-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
