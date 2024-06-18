// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCivffWogz41JKHoFMohYonGxST2Zo3f_I",
    authDomain: "fir-tutoria-6bc48.firebaseapp.com",
    projectId: "fir-tutoria-6bc48",
    storageBucket: "fir-tutoria-6bc48.appspot.com",
    messagingSenderId: "902400868278",
    appId: "1:902400868278:web:81b8fadf8ce1d3a0008b17",
    measurementId: "G-ZQMQSY058W"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => signInWithPopup(auth, provider);
const signOutUser = () => signOut(auth);

export { db, storage, auth, signInWithGoogle, signOutUser };
