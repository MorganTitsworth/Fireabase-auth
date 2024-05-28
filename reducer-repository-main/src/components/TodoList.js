import React, { useState } from "react";
import { useTodo } from "./TodoContext";
import "./TodoList.css";

const TodoList = () => {
const { state, dispatch } = useTodo();
const [newTask, setNewTask] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
    dispatch({ type: "ADD_TASK", payload: newTask });
    setNewTask("");
    }
//Creates the handleSubmit function.  
//preventDefault() makes the default action to not be taken if the even is not explicitly handled.  
//checks if value of newTask after trimming for truth.  If the value is not empty, the condition is true and a non-empty task inside "" will be added.
//dispatch adds a task related to useTodo from TodoContext and refers to the ADD_TASK object
};
const toggleTask = (id) => {
    dispatch({ type: "TOGGLE_TASK", payload: id });
};
//dispatch that refers to TOGGLE_TASK in useTodo from TodoContext and adjusts the task's completion status
const removeTask = (id) => {
    dispatch({ type: "REMOVE_TASK", payload: id });
};
//dispatch that refers to REMOVE_TASK in useTodo from TodoContext and removes the task added
return (
    <div className="todo-container">

    <div className="todo-form">
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
//This is the form for adding new tasks.  You newTask handles the input text and onChange updates the value whenever it changes.  handleSubmit is called when the form is submitted through the button press.
        /> 
        <button type="submit">Add Task</button>        
        </form>

        {state.tasks.map((task) => (
        <ul key={task.id}>
            <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)} 
            />
            <span
            style={{
                textDecoration: task.completed ? "line-through" : "none",
            }}
//Renders as checkbox for toggling the completion status of a task.  If the task is completed, the span element is created here and upon completion (the box is checked) the task is crossed through otherwise it is set to none (un clicked) both of which are relative to the task ID.             
            >
            {task.text}
            </span>
            <button onClick={() => removeTask(task.id)}>Remove</button>
        </ul>
        ))}
    </div>
    </div>
);
};
export default TodoList;
