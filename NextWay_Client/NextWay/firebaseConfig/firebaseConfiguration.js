
import { initializeApp } from "firebase/app";

import {initializeAuth, getReactNativePersistence} from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCaH6pHWFScV9tvxS0XaZBKnwrMSOlOWfQ",
  authDomain: "nextway-9b30a.firebaseapp.com",
  projectId: "nextway-9b30a",
  storageBucket: "nextway-9b30a.appspot.com",
  messagingSenderId: "815961092721",
  appId: "1:815961092721:web:21c02bc04a0494561261d0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = initializeAuth(firebaseApp,{
    persistence:getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(firebaseApp);
