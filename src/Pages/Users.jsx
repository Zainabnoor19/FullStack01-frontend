import React, { useState, useEffect } from 'react';
import api from '../config/service';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load from cache first
      const cachedUsers = localStorage.getItem('usersList');
      if (cachedUsers) {
        const parsedUsers = JSON.parse(cachedUsers);
        if (parsedUsers.length > 0) {
          setUsers(parsedUsers);
        }
      }
      
      // Try to fetch fresh data
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login again');
        setLoading(false);
        return;
      }
      
      const response = await api.get('/api/v1/auth/getuser');
      console.log('Users API response:', response.data);
      
      if (response.data.status && response.data.data) {
        setUsers(response.data.data);
        localStorage.setItem('usersList', JSON.stringify(response.data.data));
        setError('');
      } else if (response.data.message === 'jwt malformed') {
        // Don't logout - just show error and use cached data
        console.log('JWT malformed, using cached data');
        if (cachedUsers) {
          setError('Using cached data. Please refresh later.');
        } else {
          setError('Session issue. Please logout and login again.');
        }
      } else {
        setError(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      const cachedUsers = localStorage.getItem('usersList');
      if (cachedUsers && JSON.parse(cachedUsers).length > 0) {
        setUsers(JSON.parse(cachedUsers));
        setError('Using cached data. Please refresh later.');
      } else {
        setError('Failed to fetch users. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await api.delete(`/api/v1/auth/user/${userId}`);
        if (response.data.status) {
          const updatedUsers = users.filter(u => u._id !== userId);
          setUsers(updatedUsers);
          localStorage.setItem('usersList', JSON.stringify(updatedUsers));
          alert('User deleted successfully');
        } else {
          alert(response.data.message || 'Failed to delete user');
        }
      } catch (error) {
        console.log(error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
        <p className="text-gray-500 mt-1">Manage all registered users</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userData, index) => (
                <tr key={userData._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {userData._id !== user?._id && (
                      <button
                        onClick={() => deleteUser(userData._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    )}
                    {userData._id === user?._id && (
                      <span className="text-gray-400 text-xs">(You)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total Users: {users.length}
      </div>
    </div>
  );
};

export default Users;