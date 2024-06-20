import React, { useState, useEffect } from 'react';
import { auth, firestore } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import './App.css'; 

const App = () => {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (user) {
      const q = query(collection(firestore, 'notes'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userNotes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotes(userNotes);
        // Save notes to localStorage
        localStorage.setItem('notes', JSON.stringify(userNotes));
      });
      return unsubscribe;
    }
  }, [user]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const newNoteRef = await addDoc(collection(firestore, 'notes'), {
        text: newNote,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      setNotes(prevNotes => [...prevNotes, { id: newNoteRef.id, text: newNote }]);
      setNewNote('');
    }
  };
  

  const handleDeleteNote = async (id) => {
    await deleteDoc(doc(firestore, 'notes', id));
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleUpdateNote = async (id, updatedText) => {
    await updateDoc(doc(firestore, 'notes', id), {
      text: updatedText
    });
  };

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <header>
        <h1>Note-Taking App</h1>
        {user ? (
          <button onClick={handleSignOut}>Sign Out</button>
        ) : (
          <button onClick={handleSignIn}>
            Sign In with Google
          </button>
        )}
      </header>
      {user && (
        <>
          <div>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter a new note"
            />
            <button onClick={handleAddNote}>Add Note</button>
          </div>
          <ul>
            {notes.map(note => (
              <li key={note.id}>
                <textarea
                  value={note.text}
                  onChange={(e) => handleUpdateNote(note.id, e.target.value)}
                />
                <button className="delete-button" onClick={() => handleDeleteNote(note.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
