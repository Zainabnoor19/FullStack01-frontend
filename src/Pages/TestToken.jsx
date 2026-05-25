import React, { useState } from 'react';
import api from '../config/service';
import { useAuthContext } from '../context/AuthContext';

const TestToken = () => {
  const { user } = useAuthContext();
  const [result, setResult] = useState(null);

  const checkToken = async () => {
    const token = localStorage.getItem('authToken');
    console.log('Stored token:', token);
    
    try {
      const response = await api.get('/api/v1/auth/getuser');
      setResult(response.data);
      console.log('API Response:', response.data);
    } catch (error) {
      setResult({ error: error.message });
      console.log('Error:', error);
    }
  };

  const clearAndRelogin = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Token Test Page</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>Current User:</strong> {user?.name || 'No user'}</p>
        <p><strong>User Role:</strong> {user?.role || 'N/A'}</p>
        <p><strong>Token in localStorage:</strong> {localStorage.getItem('authToken') ? 'Yes' : 'No'}</p>
        <p><strong>Token value:</strong> {localStorage.getItem('authToken')?.substring(0, 50)}...</p>
      </div>
      
      <div className="space-x-4">
        <button 
          onClick={checkToken}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Check Token
        </button>
        
        <button 
          onClick={clearAndRelogin}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear & Re-login
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