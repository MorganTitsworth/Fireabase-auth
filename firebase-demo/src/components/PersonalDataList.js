// src/components/PersonalDataList.js
import React, { useEffect, useState } from "react";
import { getData, deleteData } from "../api/crud";
import PersonalDataForm from "./PersonalDataForm";

const PersonalDataList = () => {
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);

  const fetchData = async () => {
    const data = await getData();
    setData(data);
  };

  const handleEdit = (data) => {
    setEditingData(data);
  };

  const handleDelete = async (id) => {
    await deleteData(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <PersonalDataForm existingData={editingData} onUpdate={fetchData} />
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.name} ({item.email})
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalDataList;
