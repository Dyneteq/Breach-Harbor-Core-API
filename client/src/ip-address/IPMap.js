import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import worldData from '../utils/world-countries.json';

const convertLocToCoordinates = (loc) => {
  const [latitude, longitude] = loc.split(',').map(Number);
  return [longitude, latitude];
};

export default function IPMap({ location = {} }) {
  const width = 800;
  const height = 808;

  const handleHover = () => ({
    fill: "#666",
    outline: "none"
  });

  return (
    <ComposableMap 
      projection="geoMercator"
      projectionConfig={{
          center: [0, 40],
          scale: 110,
      }}
      width={width}
      height={height}
      style={{ backgroundColor: '#000', border: '1px solid #000', borderRadius: '5px' }}
    >
      <Geographies geography={worldData}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const hasMarker = geo.properties['Alpha-2'] === location.countryCode;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: hasMarker ? 'rgba(220, 53, 69, 0.6)' : '#444',
                    outline: "none",
                    stroke: "#000", // Black country borders
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
      {location.countryCode && (
        <Marker coordinates={convertLocToCoordinates(location.coordinates)}>
        </Marker>
      )}
    </ComposableMap>
  )
}
