import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/authContext";
import { useEffect } from "react";

const MainLayout = () => {
  const { isAuthenticated, userRole, isVerified } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated == "undefined") {
      return;
    }

    const inApp = segments[0] == "appScreens";

    // Handle user redirection based on authentication and verification state
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
  }, [isAuthenticated, userRole, isVerified]);

  return <Slot />;
};

export default function _layout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
