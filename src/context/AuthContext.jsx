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
      // First check localStorage for cached user (ALWAYS show this first)
      const cachedUser = getUser();
      if (cachedUser && cachedUser._id) {
        setUser(cachedUser);
        console.log('Using cached user on refresh:', cachedUser.name);
      }
      
      // Try to fetch fresh data from backend (don't wait for this)
      try {
        const res = await fetchUser();
        console.log('Fetch user response:', res);
        
        if (res && res._id) {
          // Save user from backend response
          saveUser(res);
          setUser(res);
          console.log('Updated user from backend:', res.name);
        }
      } catch (backendError) {
        // DON'T logout on backend error - just keep cached user
        console.log('Backend fetch failed, keeping cached user');
      }
      
    } catch (error) {
      console.log('error in userLoad--->', error);
      // Keep cached user if exists
      const cachedUser = getUser();
      if (cachedUser && cachedUser._id) {
        setUser(cachedUser);
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