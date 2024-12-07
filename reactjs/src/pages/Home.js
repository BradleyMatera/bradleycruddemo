import { Link } from 'react-router-dom';
import '../styles/App.css';

function Home() {
  return (
    <div className="App animated-background">
      {/* Add animated background class */}
      <header className="App-header">
        <h1>Welcome to the Student List</h1>
        <Link to="/dashboard" className="dashboard-button">
          Dashboard
        </Link>
      </header>
    </div>
  );
}

export default Home;