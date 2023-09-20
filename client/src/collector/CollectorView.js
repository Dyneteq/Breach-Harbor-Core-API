import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import { Link, useParams } from 'react-router-dom';
import HumanizeDateTime from '../utils/HumanizeDateTime';
import IncidentTable from '../dashboard/IncidentTable';
import config from '../config/config';

const CollectorView = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const [collectorData, setCollectorData] = useState(null);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [incidentsData, setIncidentsData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(`${config.apiBaseUrl}/collector/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCollectorData(data);
          setError(null);

          // Fetch incidents after fetching collectorData
          const incidentsResponse = await fetchWithAuth(`${config.apiBaseUrl}/collector/${id}/incident/get_all?limit=10`);
          const incidentsData = await incidentsResponse.json();
          if (incidentsResponse.ok) {
            setIncidentsData(incidentsData);
          } else {
            throw new Error("Couldn't fetch incidents data.");
          }
        } else {
          setError(data.error);
          throw new Error("Couldn't fetch data for the given Collector ID.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id, fetchWithAuth]);


  const renderIsOnlineIcon = (lastOnlineAt) => {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const isOnline = new Date(lastOnlineAt) > oneMinuteAgo;

    if (isOnline) {
      return <span className="me-3"><i className="fas fa-circle text-success"></i></span>;
    } else {
      return <span className="me-3"><i className="fas fa-circle text-danger"></i></span>;
    }
  };

  const renderIsVerifiedIcon = (lastOnlineAt) => {
    if (lastOnlineAt) {
      return <span className="me-3"><i className="fas fa-check-circle text-success"></i></span>;
    } else {
      return <span className="me-3"><i className="fas fa-warning text-danger"></i></span>;
    }
  };

  const renderIsVerified = (lastOnlineAt) => {
    if (lastOnlineAt) {
      return (
        <div className="my-3">
          {renderIsVerifiedIcon(lastOnlineAt)}
          This device has been verified
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger my-3">
          {renderIsVerifiedIcon(lastOnlineAt)}
          This device has not been verified
        </div>
      );
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">
        <Sidebar auth={auth} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />
        <div className="d-flex flex-column flex-grow-1">
          <Navbar />
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-center px-5">
              <div className="container-fluid text-start mt-5">
                <h2 className="mb-5 fw-light">Collector Details</h2>
                <div className="row mb-5">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <div className="card p-3">
                      <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {collectorData && (
                          <>
                            {renderIsVerified(collectorData.last_online_at)}
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td className='w-25'><strong>Name:</strong></td>
                                  <td>{collectorData.name}</td>
                                </tr>
                                <tr>
                                  <td><strong>IP Address:</strong></td>
                                  <td>
                                    <Link to={`/ip-address/${collectorData.ip_address}`}>
                                      {collectorData.ip_address}
                                      <i className="fas fa-search ms-2"></i>
                                    </Link>
                                  </td>
                                </tr>
                                <tr>
                                  <td><strong>Token:</strong></td>
                                  <td style={{ 'max-width': '100px', 'word-wrap': 'break-word' }}>{collectorData.token}</td>
                                </tr>
                                <tr>
                                  <td><strong>Last Online At:</strong></td>
                                  <td><HumanizeDateTime dateTime={collectorData.last_online_at} /></td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mb-5">
                  <h5 className='mb-4'>Incidents</h5>
                  {collectorData && (
                    <IncidentTable incidents={incidentsData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorView;
