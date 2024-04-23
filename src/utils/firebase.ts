// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {connectAuthEmulator, getAuth } from "firebase/auth";
import {connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD70wqk2KYojBO_fAEiWEhDbiz4lo8vw2s",
    authDomain: "budget-19.firebaseapp.com",
    projectId: "budget-19",
    storageBucket: "budget-19.appspot.com",
    messagingSenderId: "208067569050",
    appId: "1:208067569050:web:eca0ff615592577d6fc623",
    measurementId: "G-QF0Z0VGCJ0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app); // Initialize Firebase Authentication
export const db = getFirestore(app);

if (import.meta.env.DEV) {
    console.log("Connecting to emulators");
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
}

