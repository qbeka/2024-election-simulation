import React, { useState, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import axios from 'axios';
import { scaleLinear } from 'd3-scale';
import { interpolateBlues, interpolateReds } from 'd3-scale-chromatic';
import '../styles/MapComponent.css';

const geoUrl = '/us-states-topojson.json';

const MapComponent = () => {
  const [statesData, setStatesData] = useState({});

  useEffect(() => {
    const fetchStateResults = () => {
      axios
        .get('http://localhost:5000/api/state-results')
        .then((response) => {
          console.log('State results:', response.data);
          setStatesData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching state results:', error);
        });
    };

    fetchStateResults();
    const interval = setInterval(fetchStateResults, 1000);
    return () => clearInterval(interval);
  }, []);

  const getFillColor = (stateCode) => {
    const stateResult = statesData[stateCode];
    if (!stateResult) {
      return '#D3D3D3'; // Grey
    } else {
      const { democrat_percentage, republican_percentage } = stateResult;
      const totalVotes = stateResult.democrat_votes + stateResult.republican_votes;
      if (totalVotes === 0) {
        return '#D3D3D3'; // Grey
      }
      const margin = Math.abs(democrat_percentage - republican_percentage);
      const colorScale = scaleLinear()
        .domain([0, 50])
        .range([0.5, 1]);

      const t = colorScale(margin);

      if (democrat_percentage > republican_percentage) {
        return interpolateBlues(t);
      } else {
        return interpolateReds(t);
      }
    }
  };

  return (
    <div className="map-container">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateCode = geo.properties.postal;
              const fillColor = getFillColor(stateCode);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapComponent;
