// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnwMm6n2gORH5Me5AHmvtytMLW9k4yUeI",
  authDomain: "expense-tracker-4f379.firebaseapp.com",
  projectId: "expense-tracker-4f379",
  storageBucket: "expense-tracker-4f379.appspot.com",
  messagingSenderId: "80847744883",
  appId: "1:80847744883:web:15889f3e55f155d53fdf06",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
