import React, { useState } from 'react';
import api from '../config/service';
import { useAuthContext } from '../context/AuthContext';

const TestToken = () => {
  const { user } = useAuthContext();
  const [result, setResult] = useState(null);

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        return value;
      }
    }
    return null;
  };

  const checkToken = async () => {
    const cookieToken = getTokenFromCookie();
    const localToken = localStorage.getItem('authToken');
    
    console.log('Cookie token:', cookieToken);
    console.log('LocalStorage token:', localToken);
    console.log('All cookies:', document.cookie);
    
    try {
      const response = await api.get('/api/v1/auth/getuser');
      setResult(response.data);
      console.log('API Response:', response.data);
    } catch (error) {
      setResult({ error: error.message });
      console.log('Error:', error);
    }
  };

  const clearAll = () => {
    localStorage.clear();
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Token Test Page</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>Current User:</strong> {user?.name || 'No user'}</p>
        <p><strong>User Role:</strong> {user?.role || 'N/A'}</p>
        <p><strong>Token in Cookie:</strong> {getTokenFromCookie() ? 'Yes' : 'No'}</p>
        <p><strong>Token in localStorage:</strong> {localStorage.getItem('authToken') ? 'Yes' : 'No'}</p>
        <p><strong>All Cookies:</strong> {document.cookie || 'None'}</p>
      </div>
      
      <div className="space-x-4">
        <button 
          onClick={checkToken}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Check Token
        </button>
        
        <button 
          onClick={clearAll}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear All & Re-login
        </button>
      </div>
      
      {result && (
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestToken;