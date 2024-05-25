// src/components/PersonalDataForm.js
import React, { useState } from "react";
import { addData, updateData } from "../api/crud";

const PersonalDataForm = ({ existingData, onUpdate }) => {
  const [data, setData] = useState(existingData || { name: "", email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.id) {
      await updateData(data.id, data);
    } else {
      await addData(data);
    }
    onUpdate();
    setData({ name: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <button type="submit">{data.id ? "Update" : "Add"} Data</button>
    </form>
  );
};

export default PersonalDataForm;
