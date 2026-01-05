// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa9ZxVQAKBdV32odWgw8dwhxQ-yxCerQY",
  authDomain: "tourify-2b2aa.firebaseapp.com",
  projectId: "tourify-2b2aa",
  storageBucket: "tourify-2b2aa.firebasestorage.app",
  messagingSenderId: "469596329956",
  appId: "1:469596329956:web:fd3c8e8f8f08c0fc3759f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
