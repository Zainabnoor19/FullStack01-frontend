import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

// ✅ Add this interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Agar 401 (unauthorized) aata hai to logout mat karo
        if (error.response?.status === 401) {
            console.log('Auth error, but keeping user data');
            // localStorage.removeItem('user');  // COMMENT THIS - Don't logout
        }
        return Promise.reject(error);
    }
);

export default api