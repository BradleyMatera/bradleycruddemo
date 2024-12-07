import { Link } from 'react-router-dom';

import '../styles/App.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Student List Homepage</h1>
        <Link to="/dashboard">Dashboard</Link>
      </header>
    </div>
  );
}

export default Home;
