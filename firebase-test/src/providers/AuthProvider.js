import React, { createContext, useReducer, useContext, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, GoogleAuthProvider } from "firebase/auth";
import {  collection, addDoc, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../api/firebase-config";
import { auth } from "../api/firebase-config";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
        //add user to firestore under top level collection "users"
        const userRef = doc(db, "users", user.uid);
        setDoc(userRef, {
          email: user.email,
          id: user.uid,
          photo: user.photoURL,
          lastLogin: new Date(),
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch({ type: "LOGIN", payload: result.user });
      })
      .catch((error) => {
        console.error("Error during sign in: ", error);
      });
  };

  const signOut = () => {
    firebaseSignOut(auth)
      .then(() => {
        dispatch({ type: "LOGOUT" });
      })
      .catch((error) => {
        console.error("Error during sign out: ", error);
      });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthProvider };