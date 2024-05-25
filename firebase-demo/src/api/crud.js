// src/api/crud.js
import { db } from "./firebase-config";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const collectionName = "personalData";

export const getData = async () => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addData = async (data) => {
  await addDoc(collection(db, collectionName), data);
};

export const updateData = async (id, data) => {
  await updateDoc(doc(db, collectionName, id), data);
};

export const deleteData = async (id) => {
  await deleteDoc(doc(db, collectionName, id));
};
