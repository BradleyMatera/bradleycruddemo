import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/AnimeCharacter.css";

function AnimeCharacter() {
  const [values, setValues] = useState({
    name: "",
    anime: "",
    powerLevel: 0,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_API_BASE_URL || `https://bradleycruddemo-1b86f27b4c16.herokuapp.com/api/v1`;

  // Fetch anime character details
  const getAnimeCharacter = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/animeCharacters/${id}`);
      if (!response.ok) throw new Error("Failed to fetch anime character");
      const data = await response.json();
      setValues(data);
    } catch (error) {
      console.error("Error fetching anime character:", error.message);
    }
  }, [API_BASE, id]);

  useEffect(() => {
    getAnimeCharacter();
  }, [getAnimeCharacter]);

  // Delete anime character
  const deleteAnimeCharacter = async () => {
    try {
      await fetch(`${API_BASE}/animeCharacters/${id}`, { method: "DELETE" });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error deleting anime character:", error.message);
    }
  };

  // Update anime character
  const updateAnimeCharacter = async () => {
    try {
      await fetch(`${API_BASE}/animeCharacters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      alert("Character updated successfully!");
    } catch (error) {
      console.error("Error updating anime character:", error.message);
    }
  };

  // Form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    updateAnimeCharacter();
  };

  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="anime-character-container">
      <header className="anime-character-header">
        <h1>Anime Character Profile</h1>
        <h5>{values.name}</h5>
        <p>{values.anime}</p>
        <p>Power Level: {values.powerLevel}</p>
        <div className="anime-character-buttons">
          <button onClick={deleteAnimeCharacter}>Delete</button>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </header>
      <form className="anime-character-form" onSubmit={handleSubmit}>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default AnimeCharacter;