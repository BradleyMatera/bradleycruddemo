import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AnimeCharacter from './pages/AnimeCharacter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/animeCharacters/:id" exact element={<AnimeCharacter />} />
        <Route path="/dashboard" exact element={<Dashboard />} />
        <Route path="/" exact element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;