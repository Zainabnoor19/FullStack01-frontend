import { Children, useEffect } from "react";
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
      // ✅ First check localStorage for cached user
      const cachedUser = getUser();
      if (cachedUser && cachedUser._id) {
        setUser(cachedUser);
      }
      
      // ✅ Then fetch fresh data from backend
      const res = await fetchUser();
      
      if (res && res._id) {
        // Save user from backend response
        saveUser(res);
        setUser(res);
      } else if (cachedUser && cachedUser._id) {
        // If backend fails but we have cached user, keep it
        console.log('Using cached user data');
      }
    } catch (error) {
      console.log('error in fetching user--->', error);
      // ✅ Keep cached user if backend fails
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