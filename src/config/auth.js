import api from './service'

export const fetchUser = async ()=>{
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('No token found');
            return null;
        }
        
        const response = await api.get(`/api/v1/auth/user-profile`)
        console.log('User profile response:', response.data);
        
        if (response.data.status && response.data.user) {
            return response.data.user
        } else {
            console.log('No user data in response');
            return null
        }
    } catch (error) {
        console.log('Error fetching user profile:', error.response?.data?.message || error.message);
        return null
    }
}