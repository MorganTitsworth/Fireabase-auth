import React from 'react';
import { TodoProvider } from './components/TodoContext';
import TodoList from './components/TodoList';
function App() {
  return (
    <div>
    <TodoProvider>
      <TodoList />
    </TodoProvider>
    </div>
  );
}
//Defines the App component and wraps TodoList inside of the TodoProvider(which provides the Todo List context).
export default App;