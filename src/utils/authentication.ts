import { GoogleAuthProvider } from "firebase/auth";
import {auth} from "./firebase.ts";
import { signInWithPopup } from "firebase/auth";

// Initialize a new Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
export const signInWithGoogle = async (): Promise<any> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log(user);
        // Return the entire user object
        return user;
    } catch (error) {
        console.error(error);
        // Return null if there was an error
        return null;
    }
};