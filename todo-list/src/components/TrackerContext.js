import React, { createContext, useContext, useReducer } from "react";

const TrackerContext = createContext();
const initialState = { txs: [] };

function trackerReducer(state, action) {
  switch (action.type) {
    case "SET_TXS":
      return {
        ...state,
        txs: action.payload,
      };
    case "ADD_TX":
      return {
        ...state,
        txs: [...state.txs, action.payload],
      };
    case "DELETE_TX":
      return {
        ...state,
        txs: state.txs.filter((tx) => tx.id !== action.payload),
      };
    case "UPDATE_TX":
      return {
        ...state,
        txs: state.txs.map((tx) =>
          tx.id === action.payload.id
            ? { ...tx, amount: action.payload.amount }
            : tx
        ),
      };
    default:
      return state;
  }
}

export function TrackerProvider({ children }) {
  const [state, dispatch] = useReducer(trackerReducer, initialState);

  return (
    <TrackerContext.Provider value={{ state, dispatch }}>
      {children}
    </TrackerContext.Provider>
  );
}

export const useTracker = () => useContext(TrackerContext);
