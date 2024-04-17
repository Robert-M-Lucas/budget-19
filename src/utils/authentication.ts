import { GoogleAuthProvider } from "firebase/auth";
import {auth} from "./firebase.ts";
import { signInWithPopup } from "firebase/auth";

// Initialize a new Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log(user);
        // Do something with the user object (e.g. save to state)
    } catch (error) {
        console.error(error);
    }
};
