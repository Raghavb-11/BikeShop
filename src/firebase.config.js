// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Uses environment variables if available, otherwise falls back to hardcoded values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyB6iyQ6iiwTosWUeRRV9S86vSkSFVBAB2g",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "house-marketplace-app-ddae6.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "house-marketplace-app-ddae6",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "house-marketplace-app-ddae6.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "423101116511",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:423101116511:web:8d4915006c1319beb5ebea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage(app);
