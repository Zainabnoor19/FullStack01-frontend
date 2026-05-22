import axios from "axios";
import api from './service'


   
export const fetchUser=async ()=>{
    const url = import.meta.env.VITE_BACKEND_URL
console.log(url);
try {
    const response = await api.get(`/api/v1/auth/user-profile`)
    return response.data.user
} catch (error) {
    console.log(error);
    
}
    
}