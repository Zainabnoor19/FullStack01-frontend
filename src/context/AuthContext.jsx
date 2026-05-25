import { useEffect } from "react";
import { createContext, useContext } from "react";
import { setUser as saveUser, getUser } from "../utils/AuthProf";
import { useState } from "react";
import { fetchUser } from "../config/auth";

const profileContext = createContext()
export const AuthContext = ({children}) => {
 const [user, setUser] = useState(null)
 const [loader , setLoader] = useState(true)
 
  const userLoad = async ()=>{
    try {
      // Check if token exists
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No token found, skipping user fetch');
        setLoader(false);
        return;
      }
      
      // First check localStorage for cached user
      const cachedUser = getUser();
      if (cachedUser && cachedUser._id) {
        setUser(cachedUser);
      }
      
      // Then fetch fresh data from backend
      const res = await fetchUser();
      console.log('Fetch user response:', res);
      
      if (res && res._id) {
        // Save user from backend response
        saveUser(res);
        setUser(res);
      } else if (cachedUser && cachedUser._id) {
        console.log('Using cached user data');
      } else {
        // No valid user, clear token
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.log('error in fetching user--->', error);
      const cachedUser = getUser();
      if (cachedUser && cachedUser._id) {
        setUser(cachedUser);
      } else {
        setUser(null);
      }
    } finally {
      setLoader(false)
    }
  }

  useEffect(()=>{
    userLoad()
  },[])
  
  return (
   <profileContext.Provider value={{user:user, setUser:setUser, loader:loader}}>
    {children}
   </profileContext.Provider>
  )
}

export const useAuthContext = () => useContext(profileContext)