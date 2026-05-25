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
    withCredentials: false  // Change to false - we'll use headers instead
})

// ✅ Add request interceptor to add token from localStorage
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request headers');
        } else {
            console.log('No token found for request:', config.url);
        }
        console.log('Request URL:', config.baseURL + config.url);
        console.log('Request Method:', config.method);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.config.url, response.status, response.data?.status);
        
        // If login response has token, save it
        if (response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
            console.log('Token saved from response');
        }
        
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.config?.url, error.response?.status, error.response?.data?.message);
        
        if (error.response?.status === 401) {
            console.log('Auth error - token may be expired');
            // Clear token on 401
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default api