import React from 'react';
import Navbar from '../components/Navbar';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to MyApp
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8">
              {user ? `Hello, ${user.name}!` : 'Please login to continue'}
            </p>
            {!user && (
              <div className="space-x-4">
                <a
                  href="/login"
                  className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="inline-block bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Features</h2>
          <p className="text-gray-600 mt-2">Everything you need in one place</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure</h3>
            <p className="text-gray-600">Your data is safe and encrypted</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast</h3>
            <p className="text-gray-600">Lightning fast performance</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Modern</h3>
            <p className="text-gray-600">Beautiful and responsive design</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;