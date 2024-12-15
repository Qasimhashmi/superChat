// firebaseConfig.js
import { initializeApp } from "firebase/app"; // Import initializeApp from Firebase v9+
import { getAuth } from "firebase/auth"; // Import authentication service
import { getFirestore } from "firebase/firestore"; // Import Firestore service

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcESM_Ku42X3WBAphGeHgXelP5LJhGG88",
  authDomain: "superchat-d4cfb.firebaseapp.com",
  projectId: "superchat-d4cfb",
  storageBucket: "superchat-d4cfb.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "910767677412",
  appId: "1:910767677412:web:115e6ea6d43c2996b1b1f1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to Firebase services
const auth = getAuth(app); // Initialize authentication
const db = getFirestore(app); // Initialize Firestore

export { auth, db };
