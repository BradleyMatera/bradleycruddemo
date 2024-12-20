import React from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Logout</h1>
        <button onClick={handleLogout}>Confirm Logout</button>
      </header>
    </div>
  );
}

export default Logout;