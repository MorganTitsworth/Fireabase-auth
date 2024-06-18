import { TrackerProvider } from "./components/TrackerContext.js";
import Transactions from "./components/Transactions.js";
import { AuthProvider, useAuth } from "./providers/AuthProvider.js";
import React from "react";
import "./App.css";

function AppContent() {
  const { user, signIn, signOut } = useAuth();

  return (
    <div>
      {!user ? (
        <div>
          <button onClick={signIn}>Sign In</button>
        </div>
      ) : (
        <div>
          <button onClick={signOut}>Sign Out</button>
          <TrackerProvider>
            <Transactions />
          </TrackerProvider>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;
