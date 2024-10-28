import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VoteLog.css';

const VoteLog = () => {
  const [log, setLog] = useState([]);

  useEffect(() => {
    const fetchStateResults = () => {
      axios
        .get('http://localhost:5000/api/state-results')
        .then((response) => {
          const entries = Object.entries(response.data).map(([stateCode, data]) => {
            return `${stateCode}: D - ${data.democrat_votes}, R - ${data.republican_votes}`;
          });
          setLog(entries);
        })
        .catch((error) => {
          console.error('Error fetching state results:', error);
        });
    };

    fetchStateResults();
    const interval = setInterval(fetchStateResults, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vote-log">
      <h2>Vote Log</h2>
      <ul>
        {log.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default VoteLog;
