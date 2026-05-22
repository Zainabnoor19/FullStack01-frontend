import axios from 'axios'


// http://localhost:3000/api/v1


const url =import.meta.env.VITE_BACKEND_URL

const api = axios.create({
    baseURL:url,
    headers:{
        "Content-Type":"application/json"

    },
    withCredentials:true
})


export default api



