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
      ? `http://localhost:8000/api/v1` // Local development
      : process.env.REACT_APP_API_BASE_URL || `https://bradleycruddemo-1b86f27b4c16.herokuapp.com/api/v1`; // Fallback to Heroku in production

  // Fetch a single anime character's details
  const getAnimeCharacter = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/animeCharacters/${id}`);
      if (!response.ok) throw new Error("Failed to fetch anime character");
      const data = await response.json();
      setValues({
        name: data.name,
        anime: data.anime,
        powerLevel: data.powerLevel,
      });
    } catch (error) {
      console.error("Error fetching anime character:", error.message);
    }
  }, [API_BASE, id]);

  // Fetch anime character details on component mount
  useEffect(() => {
    getAnimeCharacter();
  }, [getAnimeCharacter]);

  // Delete an anime character
  const deleteAnimeCharacter = async () => {
    try {
      const response = await fetch(`${API_BASE}/animeCharacters/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete anime character");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error deleting anime character:", error.message);
    }
  };

  // Update an anime character's details
  const updateAnimeCharacter = async () => {
    try {
      const response = await fetch(`${API_BASE}/animeCharacters/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update anime character");
      alert("Anime character updated successfully!");
    } catch (error) {
      console.error("Error updating anime character:", error.message);
    }
  };

  // Handle form submission for updates
  const handleSubmit = (event) => {
    event.preventDefault();
    updateAnimeCharacter();
  };

  // Handle input field changes
  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="anime-character-container">
      <header className="anime-character-header">
        <h1>Anime Character Profile</h1>
        <h5>{values.name}</h5>
        <p>{values.anime}</p>
        <p>Power Level: {values.powerLevel}</p>
        <div className="anime-character-buttons">
          <button onClick={deleteAnimeCharacter}>Delete Character</button>
          <Link to="/dashboard">Dashboard</Link>
        </div>
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
      </header>
    </div>
  );
}

export default AnimeCharacter;