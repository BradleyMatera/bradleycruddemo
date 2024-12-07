import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';

// Import the enhanced student styles
import '../styles/Student.css';

function Student() {
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    name: '',
    class: ''
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE = process.env.NODE_ENV === 'development'
    ? `http://localhost:8000/api/v1` 
    : process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getStudent();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const getStudent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students/${id}`);
      const data = await response.json();
      setValues({
        name: data.name,
        class: data.class
      });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateStudent();
  };

  const handleInputChanges = (event) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <div className="student-container">
      <header className="student-header">
        <h1>Student Profile</h1>
        <h5>{values.name}</h5>
        <p>{values.class}</p>
        <button onClick={deleteStudent} className="delete-button">Delete Student</button>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <form onSubmit={handleSubmit} className="student-form">
          <label>
            Name:
            <input type="text" name="name" value={values.name} onChange={handleInputChanges} />
          </label>
          <label>
            Class:
            <input type="text" name="class" value={values.class} onChange={handleInputChanges} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </header>
    </div>
  );
}

export default Student;