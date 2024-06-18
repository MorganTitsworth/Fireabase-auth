import React, { useState } from 'react';
import { ContactsProvider, useContacts } from './components/ContactsContext';
import { AuthProvider, useAuth } from './api/AuthContext';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const AppContent = () => {
  const [currentContact, setCurrentContact] = useState(null);
  const { addContact, updateContact } = useContacts(); // created by useContext in ContactsContext.js
  const { user, signInWithGoogle, signOutUser } = useAuth(); // created by useContext in AuthContext.js

  const handleSaveContact = (contact) => {
    if (currentContact) {
      updateContact(currentContact.id, contact);
    } else {
      addContact(contact);
    }
    setCurrentContact(null);
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: 4,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          height: '100vh',
        }}
      >
        <Typography variant="h4">Please sign in</Typography>
        <Button variant="contained" onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        height: '100vh',
      }}
    >
      <Typography variant="h5">Welcome, {user.email}</Typography>
      <Button variant="outlined" onClick={signOutUser}>Sign Out</Button>
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            p: 3,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border:"solid"
          }}
        >
         <ContactForm contact={currentContact} onSave={handleSaveContact} />
      </Box>
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            p: 3,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border:"solid"
          }}
        >
          <ContactList onEdit={setCurrentContact} />
      </Box>
    </Box>
  );
};

const App = () => (
  <AuthProvider>
    <ContactsProvider>
      <CssBaseline />
      <AppContent />
    </ContactsProvider>
  </AuthProvider>
);

export default App;
