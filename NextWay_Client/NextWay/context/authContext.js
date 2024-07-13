
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [role, setRole] = useState('');

  useEffect(() => {
   
    setTimeout(()=>{
      setIsAuthenticated(false)
    },1000);
  
  }, []);

  return (
    <AuthContext.Provider value={{ user,isAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth =()=>{
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth not wrapped inside AuthProvider ')
        
    }
    return value;

}





