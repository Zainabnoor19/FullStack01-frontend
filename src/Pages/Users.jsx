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
        setUsers(JSON.parse(cachedUsers));
      }
      
      const response = await api.get('/api/v1/auth/getuser');
      console.log('Users API response:', response.data);
      
      if (response.data.status && response.data.data) {
        setUsers(response.data.data);
        localStorage.setItem('usersList', JSON.stringify(response.data.data));
        setError('');
      } else if (response.data.message === 'jwt malformed') {
        // Cookie might be missing or expired
        console.log('JWT malformed - cookie issue');
        setError('Session expired. Please logout and login again.');
      } else {
        setError(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      const cachedUsers = localStorage.getItem('usersList');
      if (cachedUsers && JSON.parse(cachedUsers).length > 0) {
        setUsers(JSON.parse(cachedUsers));
        setError('Using cached data. Please refresh.');
      } else {
        setError('Failed to fetch users. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains same
};

export default Users;