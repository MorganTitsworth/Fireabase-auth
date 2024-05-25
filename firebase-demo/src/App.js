// src/App.js
import React from "react";
import "./App.css";
import { useAuth } from "./providers/AuthProvider"; //useContext
import PersonalDataList from "./components/PersonalDataList";

function App() {
  const { user, signIn, signOut } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <div>
            <button onClick={signOut}>Sign OUT</button>
            {user.displayName}
            <PersonalDataList />
          </div>
        ) : (
          <div>
            <button onClick={signIn}>Sign IN with Google</button>
            Sign In!
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
