import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const IncidentMap = ({ location }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  function kmToPixels(latitude, km, map) {
    const earthCircumference = 40075.017;  // Earth's circumference in km
    const tileSize = 256;  // default tile size for Leaflet

    // Calculate the number of pixels representing one degree of latitude for the current zoom level
    const pixelsPerDegree = tileSize * Math.pow(2, map.getZoom()) / 360;

    // Convert accuracy radius from km to degrees
    const kmPerDegree = earthCircumference / 360;
    const kmInDegrees = km / kmPerDegree;

    // Convert km in degrees to pixels
    return kmInDegrees * pixelsPerDegree;
  }

  useEffect(() => {
    const map = L.map(mapRef.current, { minZoom: 4, maxZoom: 6, zoomControl: true }).setView([35, -5], 5);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(map);

    const markerGroup = L.layerGroup().addTo(map);

    location.forEach((loc, index) => {
      const coordinates = loc.coords.split(',');
      const lat = parseFloat(coordinates[0]);
      const lng = parseFloat(coordinates[1]);
      const pixelRadius = kmToPixels(lat, loc.accuracy_radius ? loc.accuracy_radius : 10, map);
      const marker = L.circleMarker([lat, lng], { color: '#0d6efd', radius: pixelRadius }).addTo(markerGroup);
      marker.bindPopup(`${loc.city}, ${loc.countryName}`);
      markersRef.current[index] = marker;
    });

    const bounds = L.latLngBounds(location.map(loc => {
      const coords = loc.coords.split(',').map(coord => parseFloat(coord));
      return coords;
    }));
    map.fitBounds(bounds);

    map.on('zoomend', () => {
      markersRef.current.forEach((marker, index) => {
        const lat = parseFloat(location[index].coords.split(',')[0]);
        const km = location[index].accuracy_radius ? location[index].accuracy_radius : 10;
        const newPixelRadius = kmToPixels(lat, km, map);
        marker.setRadius(newPixelRadius);
      });
    });

    const resizeMap = () => {
      if (map) {
        map.invalidateSize();
      }
    };

    window.addEventListener('resize', resizeMap);

    return () => {
      map.off('zoomend');
      window.removeEventListener('resize', resizeMap);
      map.remove();
    };
  }, [location]);

  const mapStyle = {
    background: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '0.6rem',
    width: '100%',
    height: '100%',
  };

  return <div id="incident-map" style={mapStyle} ref={mapRef}></div>;
};

export default IncidentMap;
