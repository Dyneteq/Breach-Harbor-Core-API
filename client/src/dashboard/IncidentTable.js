import React from 'react';
import { Link } from 'react-router-dom';
import HumanizeDateTime from '../utils/HumanizeDateTime';
import IncidentTypeBadge from './IncidentTypeBadge';

const IncidentTable = ({ incidents }) => {
  return (
    <div className='table-responsive px-4 bg-white rounded'>
      <table className="table mt-4 rounded">
        <thead>
          <tr>
            <th>Service</th>
            <th>IP Address</th>
            <th>Location</th>
            <th>Happened At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td><IncidentTypeBadge incidentType={incident.incident_type} /></td>
              <td>
                <Link className="text-decoration-none" to={`/ip-address/${incident.ip_address_str}`}>
                  {incident.ip_address_str}
                </Link>
              </td>
              <td>
                {incident.location_address ? incident.location_address : (
                  <span>-</span>
                )}
              </td>
              <td><HumanizeDateTime dateTime={incident.happened_at} /></td>
              <td>
                <Link to={`/incident/${incident.id}`}>
                  <i className="fas fa-search"></i>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default IncidentTable;
