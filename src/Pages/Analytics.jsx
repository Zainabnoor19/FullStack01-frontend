import React, { useState, useEffect } from 'react';
import api from '../config/service';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    recentUsers: [],
    userGrowth: []
  });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Check cached users first
      const cachedUsers = localStorage.getItem('usersList');
      if (cachedUsers) {
        const users = JSON.parse(cachedUsers);
        updateStats(users);
      }
      
      // ✅ Fix: Remove extra 'api/' - use correct endpoint
      const response = await api.get('/api/v1/auth/getuser');
      console.log('Analytics API response:', response.data);
      
      if (response.data.status && response.data.data) {
        const users = response.data.data;
        // Cache users
        localStorage.setItem('usersList', JSON.stringify(users));
        updateStats(users);
        setError(null);
      } else {
        setError('No users data available');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      // ✅ Use cached data if backend fails
      const cachedUsers = localStorage.getItem('usersList');
      if (cachedUsers) {
        const users = JSON.parse(cachedUsers);
        updateStats(users);
        setError('Using cached data (Backend not responding)');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (users) => {
    if (!users || !Array.isArray(users)) {
      setStats({
        totalUsers: 0,
        totalAdmins: 0,
        recentUsers: [],
        userGrowth: []
      });
      return;
    }
    
    const admins = users.filter(u => u.role === 'admin');
    const recentUsers = [...users].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ).slice(0, 5);
    
    setStats({
      totalUsers: users.length,
      totalAdmins: admins.length,
      recentUsers: recentUsers,
      userGrowth: calculateGrowth(users)
    });
  };

  const calculateGrowth = (users) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const count = users.filter(u => {
        if (!u.createdAt) return false;
        const userDate = new Date(u.createdAt);
        userDate.setHours(0, 0, 0, 0);
        return userDate.getTime() === date.getTime();
      }).length;
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: count
      });
    }
    return last7Days;
  };

  if (loading && stats.totalUsers === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your application</p>
        {error && (
          <div className="mt-2 p-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalUsers}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Users</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👑</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalAdmins}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Total Admins</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {stats.totalUsers > 0 ? Math.round((stats.totalAdmins / stats.totalUsers) * 100) : 0}%
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">Admin Ratio</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">
              {stats.userGrowth.reduce((sum, day) => sum + day.count, 0)}
            </span>
          </div>
          <h3 className="text-gray-600 font-medium">New Users (7d)</h3>
        </div>
      </div>

      {/* User Growth Chart */}
      {stats.userGrowth.some(day => day.count > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Growth (Last 7 Days)</h2>
          <div className="flex items-end space-x-2 h-64">
            {stats.userGrowth.map((day, index) => {
              const maxCount = Math.max(...stats.userGrowth.map(d => d.count), 1);
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-indigo-100 rounded-t-lg relative" style={{ height: '200px' }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-indigo-600 rounded-t-lg transition-all duration-500"
                      style={{ 
                        height: `${(day.count / maxCount) * 200}px`,
                        width: '100%'
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-indigo-600">
                        {day.count}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentUsers.map((userData) => (
                <tr key={userData._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {userData.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                      </div>
                    </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userData.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      userData.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {userData.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {stats.recentUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found. Login as admin first.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;