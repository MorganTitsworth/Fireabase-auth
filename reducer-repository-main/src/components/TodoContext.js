import React, { createContext, useContext, useReducer } from "react";

const TodoContext = createContext();
const initialState = {
tasks: [],
};
//"tasks" represents the list of tasks in the to do list with an empty array.
const todoReducer = (state, action) => {
//The todoReducer is defined with the state and action parameters.  
switch (action.type) {
    case "ADD_TASK":
    return {
        ...state,
        tasks: [
        ...state.tasks,
        { id: Date.now(), text: action.payload, completed: false },
        ],
    };
//Handles the action of adding a task.  Returns the new state object with the original state spread with a new tasks array.  This new tasks array is made by spreading the existing tasks and adding a new object.  Date.now creates the new ID and the action payload creates the text value.
    case "TOGGLE_TASK":
    return {
        ...state,
        tasks: state.tasks.map((task) =>
        task.id === action.payload
            ? { ...task, completed: !task.completed } 
            : task
        ),
    };
//Handles the action of toggling the completion of the task.  Returns the new state object with the original state spread and the modified tasks array.  The map function iterates over each task.  If the task ID matches the action payload, the task can be toggled.  If not, the task remains unchanged.  
    case "REMOVE_TASK":
    return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
    };
    default:
    return state;
}
};
//Handles the action of removing a task from the to do list.  Returns a new state object with the original state spread and the modified task array.  Filter removes the task with the ID matched in the action payload.  Default is the fail safe to always return to the current state if the three cases aren't fulfilled.
export const TodoProvider = ({ children }) => {
//Exports as TodoProvider, taking children as an object destructuring.
const [state, dispatch] = useReducer(todoReducer, initialState);
//Initializes state and dispatch with useReducer.  With this, todoReducer manages state transitions and initialState initializes the states.  
return (
    <TodoContext.Provider value={{ state, dispatch }}>
    {children}
    </TodoContext.Provider>
);
};
export const useTodo = () => useContext(TodoContext);
