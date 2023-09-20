import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import IncidentTypeBadge from '../dashboard/IncidentTypeBadge';
import HumanizeDateTime from '../utils/HumanizeDateTime';
import config from '../config/config';

const IncidentList = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetchWithAuth(`${config.apiBaseUrl}/collector/incident/get_all?limit=30`);
        const data = await response.json();

        if (response.ok) {
          setIncidents(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch IP addresses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, [fetchWithAuth]);

  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">

        <Sidebar auth={auth} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />

        <div className="d-flex flex-column flex-grow-1">
          <Navbar />

          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-center px-5">
              <div className="container-fluid text-start mt-5">
                <h2 className="mb-5 fw-light">Incidents</h2>
                <div className="row mb-4">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <div className='table-responsive px-4 bg-white rounded'>
                      {isLoading ? <div>Loading...</div> : (
                        <table className="table table-striped mt-4" style={{ background: '#000 !important' }}>
                          <thead>
                            <tr>
                              <th>Incident Type</th>
                              <th>Collector</th>
                              <th>Attacker IP</th>
                              <th>Location</th>
                              <th>Happened At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incidents.map((incident, index) => (
                              <tr key={index}>
                                <td><IncidentTypeBadge incidentType={incident.incident_type} /></td>
                                <td>
                                  <Link className="text-decoration-none" to={`/collector/${incident.collector_name}`}>
                                    {incident.collector_name}
                                  </Link>
                                </td>
                                <td>
                                  <Link className="text-decoration-none" to={`/ip-address/${incident.ip_address_str}`}>
                                    {incident.ip_address_str}
                                  </Link>
                                </td>
                                <td>
                                  {incident.location_address ?
                                    incident.location_address : (
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentList;
