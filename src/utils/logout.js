import api from '../config/service';

const logoutUser = async (navigate, setUser) => {

  try {

    // ✅ Backend logout
    await api.get('/api/v1/auth/logout');

    // ✅ Remove localStorage
    localStorage.removeItem('user');

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

    // ✅ Even if API fails
    localStorage.removeItem('user');

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