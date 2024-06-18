// ContactsContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../api/firebase';
import { useAuth } from '../api/AuthContext';

const ContactsContext = createContext();

const initialState = {
  contacts: [],
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload, loading: false };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
      };
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const ContactsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const q = query(collection(db, 'contacts'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const contacts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        dispatch({ type: 'SET_CONTACTS', payload: contacts });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error });
      }
    };

    fetchContacts();
  }, [user]);

  const addContact = async (contact) => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, 'contacts'), { ...contact, userId: user.uid });
      dispatch({ type: 'ADD_CONTACT', payload: { id: docRef.id, ...contact, userId: user.uid } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  };

  const updateContact = async (id, contact) => {
    try {
      await updateDoc(doc(db, 'contacts', id), contact);
      dispatch({ type: 'UPDATE_CONTACT', payload: { id, ...contact } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  };

  const deleteContact = async (id) => {
    try {
      await deleteDoc(doc(db, 'contacts', id));
      dispatch({ type: 'DELETE_CONTACT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  };

  return (
    <ContactsContext.Provider value={{ state, addContact, updateContact, deleteContact }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => useContext(ContactsContext); //retrieving data from ContactContext.js
