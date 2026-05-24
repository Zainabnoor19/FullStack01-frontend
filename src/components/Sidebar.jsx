import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const { loader, user } = useAuthContext();

  const adminItems = [
    { name: 'Dashboard', icon: '🏠', path: '/', enabled: true },
    { name: 'About', icon: '📊', path: '/about', enabled: true },
    { name: 'Analytics', icon: '📈', path: '/analytics', enabled: true },
    { name: 'All Users', icon: '👥', path: '/users', enabled: true },
  ];

  const userItems = [
    { name: 'Dashboard', icon: '🏠', path: '/', enabled: true },
    { name: 'About', icon: '📊', path: '/about', enabled: true },
    { name: 'My Profile', icon: '👤', path: '/my-profile', enabled: true },
    { name: 'My Activity', icon: '📝', path: '/my-activity', enabled: true },
  ];

  const guestItems = [
    { name: 'Home', icon: '🏠', path: '/', enabled: true },
    { name: 'About', icon: 'ℹ️', path: '/about', enabled: true },
  ];

  // Decide which menu items to show based on role
  let displayMenuItems = [];

  if (user?.role === 'admin') {
    displayMenuItems = adminItems;
  } else if (user?.role === 'user') {
    displayMenuItems = userItems;
  } else {
    displayMenuItems = guestItems;
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 h-screen flex flex-col fixed left-0 top-0 z-40 border-r border-slate-800">
      
      {/* Branding Area */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800 font-bold text-xl tracking-wider text-indigo-400">
        {user?.role === 'admin'
          ? 'Admin Dashboard'
          : user?.role === 'user'
          ? 'User Dashboard'
          : 'Guest'}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {displayMenuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium group-hover:text-white">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* User Section - Dynamic user data */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || 'G'}
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {user?.name || 'Guest'}
            </p>

            <p className="text-xs text-slate-400 capitalize">
              {user?.role || 'guest'}
            </p>
          </div>
        </div>

        {/* Login Option - Only show when user is NOT logged in */}
        {!user && (
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 mt-2"
          >
            <span className="text-sm font-medium">Login</span>
          </Link>
        )}
      </div>
    </aside>
  );
}