import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import LocationSection from '../ip-address/sections/LocationSection';
import HumanizeDateTime from '../utils/HumanizeDateTime';
import IncidentTypeBadge from '../dashboard/IncidentTypeBadge';
import config from '../config/config';

const IncidentView = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const [response, setResponse] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [incidentData, setIncidentData] = useState(null); // Holds fetched incident data
  const [error, setError] = useState(null); // Holds any error if occurred during fetch

  const { id } = useParams(); // Retrieving the ID from the URL

  const BHSSHAlert = ({ incidentType, metadata }) => {
    if (incidentType === 'BH-SSH' && metadata.username && metadata.password) {
      return (
        <div className="alert alert-danger my-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Attacker tried to login via <span className="fw-bold fs-6">SSH</span> with username <span className="fw-bold fs-6">{metadata.username}</span> and password <span className="fw-bold fs-6">{metadata.password}</span>
        </div>
      );
    }
    return null; // Return nothing if the conditions are not met
  }

  useEffect(() => {
    // Fetch incident data based on the ID
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`${config.apiBaseUrl}/collector/incident/${id}`);
        const data = await response.json();
        if (response.ok) {
          setResponse(data);
          setError(null);
          setIncidentData(data);
        } else {
          setError(data.error);
          setResponse(null);
          throw new Error("Couldn't fetch data for the given ID.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id, fetchWithAuth]);

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">
        <Sidebar auth={auth} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />

        <div className="d-flex flex-column flex-grow-1">
          <Navbar />

          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-center px-5">

              <div className="container-fluid text-start mt-5">
                <h2 className="mb-5 fw-light">Incident</h2>
                <div className="row mb-5">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <div className="card p-3">
                      <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {incidentData && (
                          <div>
                            <h5 className="mb-5">General information</h5>
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className="w-25"><strong>Service:</strong></td>
                                  <td><IncidentTypeBadge incidentType={incidentData.incident_type} /></td>
                                </tr>
                                <tr>
                                  <td><strong>Collector ID:</strong></td>
                                  <td>
                                    <Link className="text-decoration-none" to={`/collector/${incidentData.collector_name}`}>
                                      {incidentData.collector_name}
                                    </Link>
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Attacker IP Address:</strong></td>
                                  <td>
                                    <Link className="text-decoration-none" to={`/ip-address/${incidentData.ip_address_str}`}>
                                      {incidentData.ip_address_str} <i className="fas fa-search ms-2"></i>
                                    </Link>
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Happened at:</strong></td>
                                  <td><HumanizeDateTime dateTime={incidentData.happened_at} /></td>
                                </tr>
                              </tbody>
                            </table>
                            <BHSSHAlert incidentType={incidentData?.incident_type} metadata={incidentData?.metadata} />
                            { incidentData.location && (
                              <LocationSection location={incidentData.location} />
                            )}
                            <div className="mt-5 mb-2">
                              <h5>Metadata</h5>
                              <pre className="mt-4 bg-light p-3 w-100"
                                style={{ 'maxWidth': '1000px', 'overflowX': 'scroll', 'wordBreak': 'break-all', 'wordWrap': 'break-word', 'whiteSpace': 'pre-wrap'  }}>
                                {JSON.stringify(incidentData.metadata, null, 2)}
                              </pre>
                            </div>
                          </div>
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
    </div>
  );
};

export default IncidentView;
