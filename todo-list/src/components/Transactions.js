import "./Transactions.css";
import { useTracker } from "./TrackerContext.js";
import { useAuth } from "../providers/AuthProvider.js";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../api/firebase-config";

export default function Transactions() {
  const { state, dispatch } = useTracker();
  const [newTx, setNewTx] = useState("");
  const { user } = useAuth();
  const [editTxId, setEditTxId] = useState(null);
  const [editTxAmount, setEditTxAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);

  async function getTxs() {
    try {
      const query = await getDocs(collection(db, "txs"));
      const txs = query.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: "SET_TXS", payload: txs });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (user) {
      getTxs();
    }
  }, []);

  useEffect(() => {
    if (user) {
      handleDisplayAmount();
    }
  }, [state.txs]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "txs"), {
        amount: parseInt(newTx),
        completed: true,
      });
      dispatch({
        type: "ADD_TX",
        payload: { id: docRef.id, amount: newTx, completed: true },
      });
    } catch (err) {
      console.log(err);
    }

    setNewTx("");
  }

  async function handleDelete(id) {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "txs", id));
      dispatch({ type: "DELETE_TX", payload: id });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, "txs", editTxId), {
        amount: parseInt(editTxAmount),
      });
      dispatch({
        type: "SET_TXS",
        payload: state.txs.map((tx) =>
          tx.id === editTxId ? { ...tx, amount: parseInt(editTxAmount) } : tx
        ),
      });
      setEditTxId(null);
      setEditTxAmount("");
    } catch (err) {
      console.error(err);
    }
  }

  function handleEdit(tx) {
    if (editTxId === tx.id) {
      setEditTxId(null);
      setEditTxAmount(0);
    } else {
      setEditTxId(tx.id);
      setEditTxAmount(tx.amount);
    }
  }

  function handleDisplayAmount() {
    let total = state.txs.reduce(
      (total, tx) => parseInt(total) + parseInt(tx.amount),
      0
    );
    setDisplayAmount(total);
  }

  return (
    <div className="container">
      <div className="transactions">
        <ul>
          {state.txs.map((tx) => (
            <li key={tx.id} className="transaction">
              {editTxId === tx.id ? (
                <>
                  <input
                    type="text"
                    value={editTxAmount}
                    onChange={(e) => setEditTxAmount(e.target.value)}
                  />
                  <div className="buttons">
                    <button onClick={handleUpdate}>Confirm</button>
                    <button onClick={() => handleEdit(tx)}>Exit</button>
                  </div>
                </>
              ) : (
                <>
                  <span>${tx.amount}</span>
                  <div className="buttons">
                    <button onClick={() => handleEdit(tx)}>Edit</button>
                    <button onClick={() => handleDelete(tx.id)}>X</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="right">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                value={newTx}
                onChange={(e) => setNewTx(e.target.value)}
              />
              <button type="submit">Add TX</button>
            </div>
          </form>
        </div>
        <div>
          <span className="display">
            Your total amount is: <strong>${displayAmount}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
