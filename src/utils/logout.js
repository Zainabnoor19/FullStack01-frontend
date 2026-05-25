import api from '../config/service';

const logoutUser = async (navigate, setUser) => {
  try {
    // ✅ Backend logout
    await api.get('/api/v1/auth/logout');

    // ✅ Remove localStorage items
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');  // Also remove token
    localStorage.removeItem('usersList');

    // ✅ Clear state
    if (setUser) {
      setUser(null);
    }

    // ✅ Redirect
    if (navigate) {
      navigate('/login');
    }

    return {
      success: true
    };

  } catch (error) {
    console.error('Logout error:', error);

    // ✅ Even if API fails, clear local data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('usersList');

    if (setUser) {
      setUser(null);
    }

    if (navigate) {
      navigate('/login');
    }

    return {
      success: false,
      error: error.message
    };
  }
};

export default logoutUser;