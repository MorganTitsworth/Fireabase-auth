// ContactForm.js
import React, { useState } from 'react';
import { useContacts } from './ContactsContext.js';

const ContactForm = ({ contact, onSave }) => {
  const [name, setName] = useState(contact ? contact.name : '');
  const [email, setEmail] = useState(contact ? contact.email : '');
  const [phone, setPhone] = useState(contact ? contact.phone : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContact = { name, email, phone };
    onSave(newContact);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Phone:</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default ContactForm;
