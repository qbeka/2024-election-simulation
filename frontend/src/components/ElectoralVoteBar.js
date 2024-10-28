import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ElectoralVoteBar.css';

const ElectoralVoteBar = () => {
  const [votes, setVotes] = useState({
    democrat_ev: 0,
    republican_ev: 0,
    undecided_ev: 538,
  });

  useEffect(() => {
    const fetchElectoralVotes = () => {
      axios
        .get('http://localhost:5000/api/electoral-votes')
        .then((response) => {
          console.log('Electoral votes:', response.data);
          setVotes(response.data);
        })
        .catch((error) => {
          console.error('Error fetching electoral votes:', error);
        });
    };

    fetchElectoralVotes();
    const interval = setInterval(fetchElectoralVotes, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalEV = 538;
  const democratPercentage = (votes.democrat_ev / totalEV) * 100;
  const republicanPercentage = (votes.republican_ev / totalEV) * 100;
  const undecidedPercentage = 100 - democratPercentage - republicanPercentage;

  return (
    <div className="electoral-vote-bar">
      <div className="labels">
        <span>Democrat</span>
        <span>270 Votes Needed to Win</span>
        <span>Republican</span>
      </div>
      <div className="bar">
        <div
          className="democrat"
          style={{ width: `${democratPercentage}%` }}
        >
          {votes.democrat_ev > 0 && votes.democrat_ev}
        </div>
        <div
          className="undecided"
          style={{ width: `${undecidedPercentage}%` }}
        ></div>
        <div
          className="republican"
          style={{ width: `${republicanPercentage}%` }}
        >
          {votes.republican_ev > 0 && votes.republican_ev}
        </div>
      </div>
    </div>
  );
};

export default ElectoralVoteBar;
