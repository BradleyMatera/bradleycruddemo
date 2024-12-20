import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/App.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_API_BASE_URL || `https://bradleycruddemo-1b86f27b4c16.herokuapp.com/api/v1`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, user_name: userName }),
      });

      if (!response.ok) {
        let errorMessage;
        // Try to parse error as JSON; fallback to plain text
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || "Signup failed";
        } catch {
          errorMessage = await response.text(); // Plain text fallback
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Save token to localStorage
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Error during signup:", error.message);
      setError(error.message); // Display error to the user
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Signup</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Signup</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <Link to="/login">Already have an account? Login</Link>
      </header>
    </div>
  );
}

export default Signup;