// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your Firebase project config (from Firebase Console -> Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyA9oB9XvrN68orlo69qXjXXRRBA-C5yZNQ",
  authDomain: "madwild.firebaseapp.com",
  projectId: "madwild",
  storageBucket: "madwild.firebasestorage.app",
  messagingSenderId: "333447108024",
  appId: "1:333447108024:web:871e0f4710c7c78655ab4d",
  measurementId: "G-2V6PE7STQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore database
export const db = getFirestore(app);

// Firebase Storage (for your photos)
export const storage = getStorage(app);
