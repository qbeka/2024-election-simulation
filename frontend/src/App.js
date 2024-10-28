import React from 'react';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import ElectoralVoteBar from './components/ElectoralVoteBar';
import VoteLog from './components/VoteLog'; // Import VoteLog

function App() {
  return (
    <div className="App">
      <Header />
      <ElectoralVoteBar />
      <MapComponent />
      <VoteLog /> {/* Add VoteLog component */}
    </div>
  );
}

export default App;
