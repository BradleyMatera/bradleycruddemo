import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/Student.css";

function Student() {
  const [values, setValues] = useState({
    name: "",
    class: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1` // Local development
      : process.env.REACT_APP_BASE_URL; // Production

  // Fetch a single student's details
  const getStudent = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/students/${id}`);
      const data = await response.json();
      setValues({
        name: data.name,
        class: data.class,
      });
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  }, [API_BASE, id]);

  // Fetch student details on component mount
  useEffect(() => {
    getStudent();
  }, [getStudent]);

  // Delete a student
  const deleteStudent = async () => {
    try {
      await fetch(`${API_BASE}/students/${id}`, { method: "DELETE" });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Update a student's details
  const updateStudent = async () => {
    try {
      await fetch(`${API_BASE}/students/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Handle form submission for updates
  const handleSubmit = (event) => {
    event.preventDefault();
    updateStudent();
  };

  // Handle input field changes
  const handleInputChanges = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="student-container">
      <header className="student-header">
        <h1>Student Profile</h1>
        <h5>{values.name}</h5>
        <p>{values.class}</p>
        <div className="student-buttons">
          <button onClick={deleteStudent}>Delete Student</button>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <form className="student-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleInputChanges}
            />
          </label>
          <label>
            Class:
            <input
              type="text"
              name="class"
              value={values.class}
              onChange={handleInputChanges}
            />
          </label>
          <input type="submit" value="Update" />
        </form>
      </header>
    </div>
  );
}

export default Student;