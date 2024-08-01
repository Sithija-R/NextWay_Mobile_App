
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig/firebaseConfiguration";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [userRole, setUserRole] = useState('');
  const [isVerified, setIsverified] = useState(false);


console.log(user)
console.log('role ',userRole)
console.log('vr ',isVerified)

  const updateUserData=async(userId)=>{
    const userdocRef = doc(db,'users',userId);
    const docSnap = await getDoc(userdocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser({...user,username:data.username,userId:data.userId,role:data.role})
      setUserRole(data.role)
     
      
    }

  }

  useEffect(() => {
   
    const unsub = onAuthStateChanged(auth, (user)=>{
      if(user){
        setIsAuthenticated(true);
        
       updateUserData(user.uid);
        const {emailVerified} = user;
        setIsverified(emailVerified);

        
        
      }else{
        setIsAuthenticated(false);
        setUser(null);

      }
    });
    return unsub;
  
  
  }, []);






  return (
    <AuthContext.Provider value={{ user,isAuthenticated, userRole }}>
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





