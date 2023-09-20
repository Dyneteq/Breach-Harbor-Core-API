import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import config from '../config/config';

const IPAddressList = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const [ipAddresses, setIpAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchIPAddresses = async () => {
      try {
        const response = await fetchWithAuth(`${config.apiBaseUrl}/analyst/get_all_ip_addresses`);
        const data = await response.json();

        if (response.ok) {
          setIpAddresses(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch IP addresses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIPAddresses();
  }, [fetchWithAuth]);

  if (error) return <p>{error}</p>;

  const renderBadge = (location) => {
    if (!location) return null;

    if (location.is_anonymous || location.is_anonymous_proxy) {
      return <span className="badge bg-warning text-dark">ANON</span>;
    }

    if (location.is_tor_exit_node) {
      return <span className="badge bg-danger">TOR</span>;
    }

    return null;
  }

  const getAccuracyRating = (radius) => {
    if (radius >= 0 && radius < 5) return <span className="text-success">EXCELLENT</span>;
    if (radius >= 5 && radius < 10) return <span className="text-primary">GOOD</span>;
    if (radius >= 10 && radius < 100) return <span className="text-warning">AVG</span>;
    if (radius >= 100) return <span className="text-danger">LOW</span>;
    return '-';
  }

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">

        {/* Sidebar */}
        <Sidebar auth={auth} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />

        <div className="d-flex flex-column flex-grow-1">
          <Navbar />

          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-center px-5">
              <div className="container-fluid text-start mt-5">
                <h2 className="mb-5 fw-light">IP Address DB</h2>
                <div className="row mb-4">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <div className='table-responsive px-4 bg-white rounded'>
                      {isLoading ? <div>Loading...</div> : (
                        <table className="table table-striped rounded mt-4">
                          <thead>
                            <tr>
                              <th></th>
                              <th>IP Address</th>
                              <th>Incidents</th>
                              <th>Country ISO</th>
                              <th>Country</th>
                              <th>Region</th>
                              <th>City</th>
                              <th>Accuracy</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ipAddresses.map((ipAddress, index) => (
                              <tr key={index}>
                                <td>
                                  {renderBadge(ipAddress.location)}
                                </td>
                                <td>
                                  <Link className="text-decoration-none link-primary fw-bold" to={`/ip-address/${ipAddress.address}`}>
                                    {ipAddress.address}
                                  </Link>
                                </td>
                                <td>
                                  <span style={{ color: ipAddress.incident_count > 100 ? 'red' : 'initial', fontWeight: ipAddress.incident_count > 100 ? 'bold' : 'normal' }}>
                                    {ipAddress.incident_count || '-'}
                                  </span>
                                </td>
                                <td>
                                  {ipAddress.location?.country_iso_code || '-'}
                                </td>
                                <td>
                                  {ipAddress.location?.country_name || '-'}
                                </td>
                                <td>
                                  {ipAddress.location?.region || '-'}
                                </td>
                                <td>
                                  {ipAddress.location?.city || '-'}
                                </td>
                                <td>
                                  {getAccuracyRating(ipAddress.location?.accuracy_radius)}
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

export default IPAddressList;
