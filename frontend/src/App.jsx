import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import DiaryPage from './pages/DiaryPage';
import MedicationPage from './pages/MedicationPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/medication" element={<MedicationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
