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
    withCredentials: true  // This sends cookies automatically
})

// ✅ Add request interceptor to ensure token is sent
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage if needed
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                // If your backend expects token in header, uncomment below
                // if (userData.token) {
                //     config.headers.Authorization = `Bearer ${userData.token}`;
                // }
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

// ✅ Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('Response success:', response.config.url, response.data?.status);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.config?.url, error.response?.status, error.response?.data?.message);
        
        // Only handle 401 for non-auth endpoints
        if (error.response?.status === 401 && !error.response?.config?.url?.includes('/auth/')) {
            console.log('Auth error on protected route');
            // Don't auto logout - just log the error
        }
        return Promise.reject(error);
    }
);

export default api