import React from 'react';
import { useContacts } from './ContactsContext';

const ContactList = ({ onEdit }) => {
  const { state, deleteContact } = useContacts();

  if (state.loading) return <p>Loading contacts...</p>;
  if (state.error) return <p>Error loading contacts: {state.error.message}</p>;

  return (
    <div>
      <h2>Contact List</h2>
      {state.contacts.map((contact) => (
        <div key={contact.id}>
          <p>
            <strong>{contact.name}</strong> - {contact.email} - {contact.phone}
          </p>
          <button onClick={() => onEdit(contact)}>Edit</button>
          <button onClick={() => deleteContact(contact.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
