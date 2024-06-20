import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAb_RJh8jcYu1MV8p9HLWDKznn0qJ88XQI",
    authDomain: "tasknoteapp-12a85.firebaseapp.com",
    projectId: "tasknoteapp-12a85",
    storageBucket: "tasknoteapp-12a85.appspot.com",
    messagingSenderId: "957109291608",
    appId: "1:957109291608:web:21738360c7467d9090182d",
    measurementId: "G-CM13T5Q83Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
