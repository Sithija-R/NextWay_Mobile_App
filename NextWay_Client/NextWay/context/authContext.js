import { onAuthStateChanged } from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../firebaseConfig/firebaseConfiguration";
import { doc, getDoc } from "firebase/firestore";
import { ScrollView, RefreshControl, View, Text } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [userRole, setUserRole] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  console.log("auth ", user);

  const updateUserData = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser({
        ...user,
        email: auth.currentUser?.email,
        phoneNumber: data.phoneNumber,
        username: data.username,
        userId: data.userId,
        role: data.role,
        age: data.age,
        profileImage: data.profileImage,
      });
      setUserRole(data.role);
    }
  };

  const checkEmailVerification = async (currentUser) => {
    await currentUser.reload();
    if (currentUser.emailVerified) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

  const refreshAuthState = () => {
    setRefreshing(true);
    setTimeout(() => {
      if (auth.currentUser) {
        checkEmailVerification(auth.currentUser);
      }
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        updateUserData(user.uid);
        setIsVerified(user.emailVerified);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      const interval = setInterval(() => {
        checkEmailVerification(auth.currentUser);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [auth.currentUser]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, userRole, isVerified, setUser }}
    >
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAuthState}
          />
        }
      >
        {children}
      </ScrollView>
    </AuthContext.Provider>

    // <AuthContext.Provider value={{ user,isAuthenticated, userRole ,isVerified}}>
    // {children}
    // </AuthContext.Provider>
    // );
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth not wrapped inside AuthProvider");
  }
  return value;
};
