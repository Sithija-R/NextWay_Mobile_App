import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/authContext";
import { useEffect } from "react";

// MainLayout component to handle user redirection and layout structure
const MainLayout = () => {
  const { isAuthenticated, userRole, isVerified } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Effect to handle redirection logic based on authentication and verification state
  useEffect(() => {
    if (typeof isAuthenticated === "undefined") {
      return;
    }
  console.log("hiy")
    const inApp = segments[0] === "appScreens";
  
    // Function to handle user redirection
    const handleRedirection = () => {
      if (isAuthenticated && !inApp) {
        if (isVerified) {
          if (userRole === "admin") {
            router.replace("dashboard");
          } else {
            router.replace("home");
          }
        } else {
          router.replace("IsVerified");
        }
      } else if (isAuthenticated === false) {
        // Redirect to sign-in screen if the user is not authenticated
        router.replace("signIn");
      }
    };
  
    // Run redirection logic immediately
    handleRedirection();
  
    // Set up an interval to run redirection logic every minute
    const interval = setInterval(() => {
      console.log("Running redirection check...");
      handleRedirection();
    }, 60000); 

    
    return () => clearInterval(interval);
  }, [isAuthenticated, userRole, isVerified, segments, router]);
  

  return <Slot />;
};

export default function _layout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
