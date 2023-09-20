import React, { useEffect } from 'react';
import L from 'leaflet';

const PublicMap = () => {
  useEffect(() => {
    const L1Data = [
      { loc: "40.7128,-74.0060", city: "New York", country: "USA" },  // New York
      { loc: "51.5074,-0.1278", city: "London", country: "UK" },     // London
      { loc: "48.8566,2.3522", city: "Paris", country: "France" },   // Paris
      { loc: "35.6895,139.6917", city: "Tokyo", country: "Japan" },  // Tokyo
      { loc: "34.0522,-118.2437", city: "Los Angeles", country: "USA" }, // Los Angeles
      { loc: "41.9028,12.4964", city: "Rome", country: "Italy" },    // Rome
      { loc: "-33.8688,151.2093", city: "Sydney", country: "Australia" }, // Sydney
      { loc: "55.7558,37.6176", city: "Moscow", country: "Russia" },  // Moscow
      { loc: "37.7749,-122.4194", city: "San Francisco", country: "USA" }, // San Francisco
      { loc: "43.6532,-79.3832", city: "Toronto", country: "Canada" }, // Toronto
      { loc: "39.9042,116.4074", city: "Beijing", country: "China" }, // Beijing
      { loc: "28.6139,77.2090", city: "Delhi", country: "India" },    // Delhi
      { loc: "-23.5505,-46.6333", city: "Sao Paulo", country: "Brazil" }, // Sao Paulo
      { loc: "31.2304,121.4737", city: "Shanghai", country: "China" }, // Shanghai
      { loc: "19.4326,-99.1332", city: "Mexico City", country: "Mexico" }, // Mexico City
      { loc: "-34.6037,-58.3816", city: "Buenos Aires", country: "Argentina" }, // Buenos Aires
      { loc: "34.0522,-118.2437", city: "Los Angeles", country: "USA" }, // Los Angeles
      { loc: "41.8781,-87.6298", city: "Chicago", country: "USA" },  // Chicago
      { loc: "51.2195,4.4024", city: "Antwerp", country: "Belgium" },  // Antwerp
      { loc: "48.2082,16.3738", city: "Vienna", country: "Austria" }  // Vienna
    ];

    const map = L.map('map', { minZoom: 2, maxZoom: 6, zoomControl: false }).setView([35, -5], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png').addTo(map);
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    const markerGroup = L.layerGroup().addTo(map);

    L1Data.forEach((city) => {
      const location = city.loc.split(',');
      const marker = L.circleMarker(location, { color: '#0d6efd', radius: 1 }).addTo(markerGroup);
      marker.bindPopup(`${city.city}, ${city.country}`);
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" className="col-12 d-flex align-items-center shadow justify-content-center"></div>;
};

export default PublicMap;