import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/App.css";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") // Check if token exists
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="App animated-background">
      <header className="App-header">
        <h1 className="welcome-title">Welcome to the Anime Characters Database</h1>
        <div className="link-container">
          <Link to="/dashboard" className="dashboard-button">
            Go to Dashboard
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="auth-button">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="auth-button">Login</Link>
              <Link to="/signup" className="auth-button">Signup</Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Home;