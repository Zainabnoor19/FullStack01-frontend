// import axios from "axios";
// import api from './service'


   
// export const fetchUser=async ()=>{
//     const url = import.meta.env.VITE_BACKEND_URL
// console.log(url);
// try {
//     const response = await api.get(`/api/v1/auth/user-profile`)
//     return response.data.user
// } catch (error) {
//     console.log(error);
    
// }
    
// }
import axios from "axios";
import api from './service'

export const fetchUser = async ()=>{
    const url = import.meta.env.VITE_BACKEND_URL
    console.log(url);
    try {
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