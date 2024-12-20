import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const [animeCharacters, setAnimeCharacters] = useState([]);
  const [values, setValues] = useState({ name: "", anime: "", powerLevel: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_API_BASE_URL || `https://bradleycruddemo-1b86f27b4c16.herokuapp.com/api/v1`;

  // Fetch characters
  const getAnimeCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/animeCharacters`, {
        headers: { Authorization: token },
      });
      if (!response.ok) throw new Error("Failed to fetch anime characters");
      const data = await response.json();
      setAnimeCharacters(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    getAnimeCharacters();
  }, [getAnimeCharacters]);

  // Create character
  const createAnimeCharacter = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/animeCharacters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to create anime character");
      await getAnimeCharacters();
      setValues({ name: "", anime: "", powerLevel: 0 });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAnimeCharacter();
  };

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Anime Characters</h1>
        <Link className="dashboard-link" to="/">Home</Link>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        <ul className="character-list">
          {animeCharacters.map((character) => (
            <li key={character._id}>
              <Link to={`/animeCharacters/${character._id}`}>{character.name}</Link>
            </li>
          ))}
        </ul>
        <form className="dashboard-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleInputChanges}
              required
            />
          </label>
          <label>
            Anime:
            <input
              type="text"
              name="anime"
              value={values.anime}
              onChange={handleInputChanges}
              required
            />
          </label>
          <label>
            Power Level:
            <input
              type="number"
              name="powerLevel"
              value={values.powerLevel}
              onChange={handleInputChanges}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Character"}
          </button>
        </form>
      </header>
    </div>
  );
}

export default Dashboard;