import { useEffect } from "react";
import { createContext, useContext } from "react";
import { getUser } from "../utils/AuthProf";
import { useState } from "react";

const profileContext = createContext()
export const AuthContext = ({children}) => {
 const [user, setUser] = useState(null)
 const [loader , setLoader] = useState(true)
 
  const userLoad = async ()=>{
    // Only load from localStorage - don't call backend
    const cachedUser = getUser();
    if (cachedUser && cachedUser._id) {
      setUser(cachedUser);
      console.log('Loaded user from localStorage:', cachedUser.name);
    }
    setLoader(false);
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