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
    <div className="home-container">
      <header className="home-header">
        <h1 className="welcome-title">Welcome to the Anime Characters Database</h1>
        <div className="button-group">
          <Link to="/dashboard" className="primary-button">
            Go to Dashboard
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="secondary-button">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="secondary-button">Login</Link>
              <Link to="/signup" className="secondary-button">Signup</Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Home;