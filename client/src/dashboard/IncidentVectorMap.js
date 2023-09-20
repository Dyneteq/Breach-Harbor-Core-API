import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import worldData from '../utils/world-countries.json';

const convertLocToCoordinates = (loc) => {
  if (!loc) return [0, 0];
  const [latitude, longitude] = loc.split(',').map(Number);
  return [longitude, latitude];
};

export default function IncidentVectorMap({ stats }) {
  const width = 800;
  const height = 408;

  const countriesWithMarkers = new Set(stats.countryStats.map((countryStat) => countryStat.countryCode));

  const handleHover = () => ({
    fill: "#444",
    outline: "none"
  });

  return (
    <ComposableMap 
      projection="geoMercator"
      projectionConfig={{
          center: [0, 40],
          scale: 130,
      }}
      width={width}
      height={height}
      style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
      className='shadow-sm'
    >
      <Geographies geography={worldData}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const hasMarker = countriesWithMarkers.has(geo.properties['Alpha-2']);
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: hasMarker ? 'rgba(220, 53, 69, 0.9)' : '#bbb',
                    outline: "none",
                    stroke: "#777",
                    strokeWidth: 0.5
                  },
                  hover: handleHover(),
                  pressed: handleHover()
                }}
              />
            )
          })
        }
      </Geographies>
      {stats.countryStats.filter(stat => stat.coordinates).map((countryStat, idx) => (
        <Marker key={idx} coordinates={convertLocToCoordinates(countryStat.coordinates)}>
        </Marker>
      ))}
    </ComposableMap>
  )
}
