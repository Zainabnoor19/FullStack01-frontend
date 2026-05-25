import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: false
})

// Request interceptor to add token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request URL:', config.baseURL + config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.config.url, response.status);
        
        // If login response has token, save it
        if (response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.config?.url, error.response?.status, error.response?.data?.message);
        
        // DON'T automatically clear token on 401 - let the user decide
        // Only clear if it's a login/register endpoint
        if (error.response?.status === 401 && error.response?.config?.url?.includes('/auth/login')) {
            console.log('Login failed');
        }
        
        return Promise.reject(error);
    }
);

export default api