import { createContext, useContext, useEffect, useState } from "react";

const profileContext = createContext()

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    // Only use localStorage, no backend calls
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoader(false);
  }, [])

  return (
    <profileContext.Provider value={{ user, setUser, loader }}>
      {children}
    </profileContext.Provider>
  )
}

export const useAuthContext = () => useContext(profileContext)