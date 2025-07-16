import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <Link to="/" style={{ margin: '0 1rem' }}>Home</Link>
      <Link to="/diary" style={{ margin: '0 1rem' }}>Diary</Link>
      <Link to="/medication" style={{ margin: '0 1rem' }}>Medication</Link>
    </nav>
  );
};

export default Navbar;
