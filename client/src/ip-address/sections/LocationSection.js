import React from 'react';
import IncidentMap from './IncidentMap';

const LocationSection = ({ location }) => {
  const formatEUStatus = (eu) => {
    if (eu === true) {
      return 'yes';
    } else if (eu === false) {
      return 'no';
    } else {
      return '-';
    }
  };

  return (
    <div className="px-1 mt-5">
      <h5 className="mb-2 text-start">Location</h5>
      <div className="row mx-0 mt-4 rounded border border-light">
        <div className="col-md-5 mt-4">
          <table className="table table-basic">
            <tbody>
              <tr className="px-2">
                <th className="text-end" style={{ width: '120px' }}>Country Code</th>
                <td className="text-start">{location.country_iso_code}</td>
              </tr>
              <tr>
                <th className="text-end">Country Name</th>
                <td className="text-start">{location.country_name}</td>
              </tr>
              <tr>
                <th className="text-end">Coordinates</th>
                <td className="text-start">{location.coords}</td>
              </tr>
              <tr>
                <th className="text-end">Region</th>
                <td className="text-start">{location.region}</td>
              </tr>
              <tr>
                <th className="text-end">EU member</th>
                <td className="text-start">{formatEUStatus(location.is_in_european_union)}</td>
              </tr>
              <tr>
                <th className="text-end">Timezone</th>
                <td className="text-start">{location.timezone}</td>
              </tr>
              <tr>
                <th className="text-end">City</th>
                <td className="text-start">{location.city}</td>
              </tr>
              <tr>
                <th className="text-end">Accuracy radius</th>
                <td className="text-start">{location.accuracy_radius}km</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-7 mt-4 mb-3">
          {location && location.coords && location.coords !== '-' ? 
            <IncidentMap location={[location]} />
          :
            <div className="card h-100">
              <div className="card-body d-flex justify-content-center align-items-center">
                Location not found
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
