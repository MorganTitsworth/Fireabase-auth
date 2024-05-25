// src/providers/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, provider } from "../api/firebase-config";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

const signIn = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
