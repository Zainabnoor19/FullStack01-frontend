import api from './service'

export const fetchUser = async ()=>{
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('No token found, but not logging out');
            // Return null but don't clear anything - just means not authenticated
            return null;
        }
        
        const response = await api.get(`/api/v1/auth/user-profile`)
        console.log('User profile response:', response.data);
        
        if (response.data.status && response.data.user) {
            return response.data.user
        } else {
            console.log('Backend returned false status, but keeping cached user');
            // IMPORTANT: Don't return null here, return cached user instead
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
                return JSON.parse(cachedUser);
            }
            return null;
        }
    } catch (error) {
        console.log('Error fetching user profile:', error.response?.data?.message || error.message);
        // Don't logout on error - return cached user if exists
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
            console.log('Returning cached user due to backend error');
            return JSON.parse(cachedUser);
        }
        return null
    }
}