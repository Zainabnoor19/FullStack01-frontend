// import axios from 'axios'

// const url = import.meta.env.VITE_BACKEND_URL

// const api = axios.create({
//     baseURL: url,
//     headers: {
//         "Content-Type": "application/json"
//     },
//     withCredentials: true
// })

// // ✅ Add this interceptor to handle errors globally
// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         // Agar 401 (unauthorized) aata hai to logout mat karo
//         if (error.response?.status === 401) {
//             console.log('Auth error, but keeping user data');
//             // localStorage.removeItem('user');  // COMMENT THIS - Don't logout
//         }
//         return Promise.reject(error);
//     }
// );

// export default api
import axios from 'axios'

const url = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

// ✅ Request interceptor to add token from localStorage
api.interceptors.request.use(
    (config) => {
        // Try to get token from user object in localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // If your backend sends token in response, add it to headers
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
                // Also try to get from separate token storage
                const token = localStorage.getItem('authToken');
                if (token && !user.token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {
                console.log('Error parsing user data');
            }
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
        console.log('Response success:', response.config.url, response.data?.status);
        
        // ✅ If login response has token, save it
        if (response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.config?.url, error.response?.status, error.response?.data?.message);
        
        if (error.response?.status === 401) {
            console.log('Auth error on protected route');
        }
        return Promise.reject(error);
    }
);

export default api