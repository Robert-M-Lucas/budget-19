import {GoogleAuthProvider, signInWithPopup, User} from "firebase/auth";
import {auth} from "./firebase.ts";

// Initialize a new Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
export const signInWithGoogle = async (): Promise<User | null> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        // Return the entire user object
        return result.user;
    } catch (error) {
        console.error(error);
        // Return null if there was an error
        return null;
    }
};