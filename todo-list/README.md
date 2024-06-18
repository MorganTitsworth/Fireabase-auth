## createContext

- creates a new context object

## useReducer

- manages state changes relative to the actions it receives

## TrackerProvider

- provides state and dispatch to its children components

## getTxns

- uses firebase method to get current items in docs
- coupled with useEffect to grab the intial Txns

## handleSubmit

- handles submissions for the form
- dispatches type "ADD_TX" and payload with data
- adds into firebase db

## handleDelete

- handles removing items from the db by finding the id

## handleEdit

- toggles edit for a transaction

## handleUpdate

- handles updating an existing transaction
- dispatches type "SET_TXS" with the updated transactions list
