import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Header.css';

const Header = () => {
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post('http://localhost:5000/api/run-simulation');
      console.log('Simulation started:', response.data);
    } catch (error) {
      console.error('Error starting simulation:', error);
      setIsRunning(false);
    }
  };

  return (
    <header className="header">
      <h1>2024 Election Simulation</h1>
      <button onClick={runSimulation} disabled={isRunning}>
        {isRunning ? 'Simulation Running...' : 'Run Simulation'}
      </button>
    </header>
  );
};

export default Header;
