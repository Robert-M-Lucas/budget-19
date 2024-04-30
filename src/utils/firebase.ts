// Import the functions you need from the SDKs you need
import {FirebaseApp, initializeApp } from "firebase/app";
import {Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import {Firestore, connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import firebase from "firebase/compat";

// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyD70wqk2KYojBO_fAEiWEhDbiz4lo8vw2s",
    authDomain: "budget-19.firebaseapp.com",
    projectId: "budget-19",
    storageBucket: "budget-19.appspot.com",
    messagingSenderId: "208067569050",
    appId: "1:208067569050:web:eca0ff615592577d6fc623",
    measurementId: "G-QF0Z0VGCJ0"
};

let _app = undefined;
let _auth = undefined;
let _db = undefined;
if (import.meta.env.MODE === "test") {
    //
}
else if (import.meta.env.DEV) {
    // Initialize Firebase
    _app = initializeApp(firebaseConfig);
    // export const analytics = getAnalytics(app);
    _auth = getAuth(_app); // Initialize Firebase Authentication
    _db = getFirestore(_app);
    console.log("Connecting to emulators");
    connectAuthEmulator(_auth, "http://localhost:9099");
    connectFirestoreEmulator(_db, "localhost", 8080);
}
else {
    // Initialize Firebase
    _app = initializeApp(firebaseConfig);
    // export const analytics = getAnalytics(app);
    _auth = getAuth(_app); // Initialize Firebase Authentication
    _db = getFirestore(_app);
}

export const app: FirebaseApp = _app!;
export const auth: Auth = _auth!;
export let db: Firestore = _db!;

export function setTestDBContext(context: Firestore | firebase.firestore.Firestore) {
    if (import.meta.env.MODE === "test") {
        db = context;
    }
}


