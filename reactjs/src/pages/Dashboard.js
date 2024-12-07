import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [values, setValues] = useState({
    name: "",
    class: "",
  });

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1` // Local development
      : process.env.REACT_APP_API_BASE_URL || `https://bradleycruddemo-1b86f27b4c16.herokuapp.com/api/v1`; // Fallback to Heroku in production

  // Function to fetch the list of students
  const getStudents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/students`);
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  }, [API_BASE]);

  // Fetch students when the component mounts
  useEffect(() => {
    getStudents();
  }, [getStudents]);

  // Function to create a new student
  const createStudent = async () => {
    try {
      const response = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to create student");
      await getStudents(); // Refresh the student list after creating a new student
      setValues({ name: "", class: "" }); // Reset form
    } catch (error) {
      console.error("Error creating student:", error.message);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    createStudent();
  };

  // Handle input changes
  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Students</h1>
        <Link className="dashboard-link" to="/">Home</Link>
        <ul className="student-list">
          {students.map((student) => (
            <li key={student._id}>
              <Link to={`/students/${student._id}`}>{student.name}</Link>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
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
            Class:
            <input
              type="text"
              name="class"
              value={values.class}
              onChange={handleInputChanges}
              required
            />
          </label>
          <button type="submit">Add Student</button>
        </form>
      </header>
    </div>
  );
}

export default Dashboard;