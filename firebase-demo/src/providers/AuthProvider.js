import { createContext, useReducer, useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { collection, setDoc } from "firebase/firestore";
import { db, auth } from "../api/firebase-config";

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch(action.type){
        case "LOGIN":
            return {...state, user: action.payload};
        case "LOGOUT":
            return {...state, user: null}
        default:
            return state;
    }
}

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                dispatch({type: "LOGIN", payload: user})
            } else {
                dispatch({type: "LOGOUT"})
            }
        })
        return () => unsubscribe()
    }, [])

    const signIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((res) => {
            console.log(res.user)
            dispatch({type: "LOGIN", payload: res.user})
        })
        .catch((error) => {
            console.error(error)
        })
    }

    const signOut = () => {
        firebaseSignOut(auth)
        .then(() => {
            dispatch({type: "LOGOUT"})
        })
        .catch((error) => {
            console.error(error)
        })
    }

    return (
        <AuthContext.Provider value={{user: state.user, signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
export { AuthProvider }