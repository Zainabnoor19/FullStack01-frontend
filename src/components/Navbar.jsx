import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import logoutUser from '../utils/logout';

const Navbar = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser(navigate, setUser);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-indigo-600">
            MyApp
          </Link>

          {/* Navigation - Only show logout when user is logged in */}
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Logout
              </button>
            ) : (
              <div></div> // Empty div when no user (login button is in sidebar)
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;