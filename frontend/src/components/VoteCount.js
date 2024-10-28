import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VoteCount.css';

const VoteCount = () => {
  const [counts, setCounts] = useState({
    valid_votes: 0,
    invalid_votes: 0,
  });

  useEffect(() => {
    const fetchVoteCounts = () => {
      axios
        .get('http://localhost:5000/api/vote-counts')
        .then((response) => {
          setCounts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching vote counts:', error);
        });
    };

    fetchVoteCounts();
    const interval = setInterval(fetchVoteCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vote-count">
      <h2>Vote Counts</h2>
      <p>Valid Votes: {counts.valid_votes}</p>
      <p>Invalid Votes: {counts.invalid_votes}</p>
    </div>
  );
};

export default VoteCount;
