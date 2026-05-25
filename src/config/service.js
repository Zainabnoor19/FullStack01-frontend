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

// Function to get token from cookie
const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
            return value;
        }
    }
    return null;
}

const api = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true  // Important for cookies
})

// Request interceptor to add token from cookie
api.interceptors.request.use(
    (config) => {
        // Try to get token from cookie first
        let token = getTokenFromCookie();
        
        // If not in cookie, try localStorage
        if (!token) {
            token = localStorage.getItem('authToken');
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request:', config.url);
        } else {
            console.log('No token for:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.config.url, response.status);
        
        // Check if response set a cookie
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            console.log('Cookie set by server');
        }
        
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.config?.url, error.response?.status);
        return Promise.reject(error);
    }
);

export default api