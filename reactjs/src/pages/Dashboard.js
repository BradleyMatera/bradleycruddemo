import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

// Import the enhanced dashboard styles
import '../styles/dashboard.css';

function Dashboard() {
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    name: '',
    class: ''
  });

  const API_BASE = process.env.NODE_ENV === 'development'
    ? `http://localhost:8000/api/v1` 
    : process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getStudents();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const getStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      await getStudents();
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createStudent();
  };

  const handleInputChanges = (event) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Students</h1>
        <Link to="/" className="dashboard-link">Home</Link>
        <ul className="student-list">
          {students?.map(student => (
            <li key={student._id}>
              <Link to={`/students/${student._id}`} className="student-link">
                {student.name}
              </Link>
            </li>
          ))}
        </ul>
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

export default Dashboard;