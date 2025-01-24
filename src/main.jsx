import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CreateAccount from "./createlogin.jsx";
import Login from './login.jsx';
import Home from './home.jsx';

// Protected Route component
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" />;
};

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false); 
  };

  return (
    <Router>
      <div>
        <Routes>
        
          <Route path="/" element={<Login onLogin={handleLogin} />} />

        
          <Route path="/create-login" element={<CreateAccount onLogin={handleLogin} />} />

        
          <Route
            path="/home"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);


