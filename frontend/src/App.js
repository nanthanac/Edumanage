import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuth ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setAuth={setIsAuth} />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            isAuth ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register setAuth={setIsAuth} />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuth ? <Dashboard setAuth={setIsAuth} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
