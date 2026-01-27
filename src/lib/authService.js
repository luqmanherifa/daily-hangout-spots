import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const registerWithEmail = async (email, password, isAdmin = false) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", result.user.uid), {
      email: result.user.email,
      role: isAdmin ? "admin" : "user",
      createdAt: serverTimestamp(),
    });

    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error };
  }
};
