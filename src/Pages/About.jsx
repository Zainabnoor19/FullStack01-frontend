import React from 'react'
import { useAuthContext } from '../context/AuthContext'

const About = () => {
  const { user } = useAuthContext()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">About Us</h1>
        <p className="text-gray-500 mt-1">Learn more about our application</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to MyApp</h2>
          
          <div className="space-y-4 text-gray-600">
            <p>
              MyApp is a modern web application built with React and Node.js, 
              providing a seamless user experience with secure authentication.
            </p>
            
            <p>
              This application features role-based access control, allowing both 
              regular users and administrators to have personalized experiences.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Features:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Secure Authentication with JWT
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Role-Based Access Control (Admin/User)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Responsive Dashboard Layout
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  User Management for Admins
                </li>
              </ul>
            </div>

            {user && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-indigo-700">
                  You are logged in as: <strong className="capitalize">{user.role}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About