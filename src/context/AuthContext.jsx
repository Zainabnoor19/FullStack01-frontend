// import { Children, useEffect } from "react";
// import { createContext,useContext } from "react";
// import {setUser as saveUser } from "../utils/AuthProf";   // save  user name only for this file (temoraray)
// import { useState } from "react";
// import { fetchUser } from "../config/auth";

// const profileContext = createContext()
// export const AuthContext = ({children}) => {
//  const [user, setUser] = useState(null)
//  const [loader , setLoader] =useState(true)
//   const userLoad = async ()=>{
//   try {
//     const res =await  fetchUser()  
    
//     // return data from authprof file (user object)
//     saveUser(res)
//     setUser(res)
//       console.log(user);
//   } catch (error) {
//     console.log('error in fetching user--->');
//     setUser(null)
    
//   }finally{
//     setLoader(false)
//   }
    
     

//   }


//   useEffect(()=>{
//     userLoad()
//   },[])
//   return (
//    <profileContext.Provider value={{user:user,setUser:setUser,loader:loader}}>
//     {children}
//    </profileContext.Provider>
//   )
// }




// export const useAuthContext = () => useContext(profileContext)


import { useEffect, useState, createContext, useContext } from "react";
import { setUser as saveUser } from "../utils/AuthProf";
import { fetchUser } from "../config/auth";

const profileContext = createContext();

export const AuthContext = ({ children }) => {

  // ✅ First load user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loader, setLoader] = useState(true);

  const userLoad = async () => {
    try {

      // ✅ Backend se latest user fetch karo
      const res = await fetchUser();

      if (res) {

        // ✅ Save in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(res)
        );

        // ✅ Save in utility file
        saveUser(res);

        // ✅ Save in state
        setUser(res);
      }

    } catch (error) {

      console.log("error in fetching user--->", error);

      // ❌ Refresh pe logout mat karo
      // setUser(null)

    } finally {

      setLoader(false);

    }
  };

  useEffect(() => {
    userLoad();
  }, []);

  return (
    <profileContext.Provider
      value={{
        user: user,
        setUser: setUser,
        loader: loader,
      }}
    >
      {children}
    </profileContext.Provider>
  );
};

export const useAuthContext = () => useContext(profileContext);