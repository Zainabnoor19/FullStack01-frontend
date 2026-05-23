import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import api from '../config/service';

const MyActivity = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // You can create an API endpoint for user activities
      // For now, showing placeholder data
      
      // Example: Fetch user's own data
      const response = await api.get(`api/v1/auth/user/${user?._id}`);
      if (response.data.status) {
        const userData = response.data.data;
        
        // Create activity from user data
        const userActivities = [
          {
            id: 1,
            type: 'joined',
            title: 'Account Created',
            description: `You joined on ${new Date(userData.createdAt).toLocaleDateString()}`,
            date: userData.createdAt,
            icon: '🎉',
            color: 'green'
          },
          {
            id: 2,
            type: 'login',
            title: 'Recent Login',
            description: 'You logged into your account',
            date: new Date().toISOString(),
            icon: '🔐',
            color: 'blue'
          },
          {
            id: 3,
            type: 'profile',
            title: 'Profile Updated',
            description: 'Your profile information is up to date',
            date: userData.updatedAt,
            icon: '👤',
            color: 'purple'
          }
        ];
        
        setActivities(userActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Show placeholder activities if API fails
      setActivities([
        {
          id: 1,
          type: 'joined',
          title: 'Welcome to MyApp',
          description: 'Start exploring the application',
          date: new Date().toISOString(),
          icon: '🎉',
          color: 'green'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (color) => {
    switch(color) {
      case 'green': return 'bg-green-100 text-green-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'red': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please login to view your activity</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Activity</h1>
        <p className="text-gray-500 mt-1">Track your recent activities</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClass(activity.color)}`}>
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-medium text-gray-800">{activity.title}</h3>
                      <span className="text-xs text-gray-400">{formatDate(activity.date)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500">No activities yet</p>
              <p className="text-sm text-gray-400 mt-1">Your activities will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl mb-1">📊</div>
          <p className="text-sm text-gray-500">Total Activities</p>
          <p className="text-xl font-bold text-gray-800">{activities.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl mb-1">📅</div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="text-sm font-medium text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl mb-1">👑</div>
          <p className="text-sm text-gray-500">Account Type</p>
          <p className="text-sm font-medium text-gray-800 capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default MyActivity;