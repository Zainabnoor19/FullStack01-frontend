import api from '../config/service';

const logoutUser = async (navigate, setUser) => {
  try {
    // 1. Backend logout API call (clears HTTP cookie)
    await api.get('api/v1/auth/logout');
    
    // 2. Remove from localStorage
    localStorage.removeItem('user');
    
    // 3. Clear React state
    if (setUser) {
      setUser(null);
    }
    
    // 4. Redirect to login page
    if (navigate) {
      navigate('/login');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if API fails, clear local data
    localStorage.removeItem('user');
    if (setUser) {
      setUser(null);
    }
    if (navigate) {
      navigate('/login');
    }
    
    return { success: false, error: error.message };
  }
};

export default logoutUser;