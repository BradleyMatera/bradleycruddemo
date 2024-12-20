import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_API_BASE_URL || `https://bradleycruddemo-1b86f27b4c16.herokuapp.com/api/v1`;

const handleSubmit = async (event) => {
  event.preventDefault();
  setError(null); // Clear any previous errors

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,      // Ensure this is populated correctly
        password,   // Ensure this is populated correctly
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || "Login failed";
      } catch {
        errorMessage = errorText || "Login failed";
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Login response:", data); // Debugging log
    localStorage.setItem("token", data.token); // Save token
    setIsLoggedIn(true); // Update login state
    navigate("/dashboard"); // Redirect to dashboard
  } catch (error) {
    console.error("Error during login:", error.message);
    setError(error.message); // Display error to the user
  }
};

  return (
    <div className="App">
      <header className="App-header">
        <h1>Login</h1>
<form onSubmit={handleSubmit}>
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
  <button type="submit">Login</button>
</form>
{error && <p className="error-message">{error}</p>}
        <Link to="/signup">Don't have an account? Sign up</Link>
      </header>
    </div>
  );
}

export default Login;