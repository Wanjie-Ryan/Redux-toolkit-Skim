// src/App.tsx

import React from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./components/login";

const App: React.FC = () => {
  return (
    <div>
      {/* Navbar always renders — it decides internally
          what to show based on isAuthenticated from the store */}
      <Navbar />

      {/* In a real app this would be React Router.
          For now we just always show LoginPage —
          it handles both logged-in and logged-out views internally */}
      <LoginPage />
    </div>
  );
};

export default App;


// User types credentials → local useState (form only)
//       │
// onClick → dispatch(loginUser({ username, email }))
//       │
// createAsyncThunk fires → pending → loading: true in store
//       │
// fetch to JSONPlaceholder → finds matching user
//       │
// fulfilled → store updates: user, isAuthenticated: true, loading: false
//       │
// useAppSelector in Navbar detects change → re-renders → shows user.name
// useAppSelector in LoginPage detects change → re-renders → shows success screen
//       │
// Page refresh → loadUserFromStorage() reads localStorage
//             → initialState already has user + isAuthenticated: true
//             → Navbar shows logged in immediately, no fetch needed