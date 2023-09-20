import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import config from '../config/config';
import IncidentTable from './IncidentTable';
import CardStatistic from './CardStatistic';
import IncidentVectorMap from './IncidentVectorMap';
import './Dashboard.css';

const Dashboard = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ totalIncidents: 0, totalIncidentsLast24h: 0, totalIpAddresses: 0, highRiskIPCount: 0, countryStats: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  const getIncidents = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${config.apiBaseUrl}/analyst/get_all_incidents?limit=15`);
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    }
  }, [fetchWithAuth]);

  const getStats = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${config.apiBaseUrl}/analyst/get_stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    setIsLoading(true);
    getIncidents();
    getStats();

    const pollInterval = setInterval(() => {
      getIncidents();
      getStats();
    }, 5000); // Poll every 5 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(pollInterval);
    };
  }, [getIncidents, getStats]);

  useEffect(() => {
    if (incidents.length > 0 && Object.keys(stats).length > 0) {
      setIsLoading(false);
    }
  }, [incidents, stats]);

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">

        <Sidebar auth={auth} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />

        <div className="d-flex flex-column flex-grow-1">
          <Navbar />

          <div className="flex-grow-1">

            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center px-5">
                <div className="container-fluid text-start mt-5 mb-5">
                  {auth ? (
                    <>
                      <h2 className="mb-5 fw-light">Dashboard</h2>
                      {incidents.length > 0 ? (
                        <>
                          <div className="row mb-4">
                            <CardStatistic title="Total Incidents" icon="fas fa-fire text-danger" value={stats.totalIncidents} />
                            <CardStatistic title="New last 24h" icon="fas fa-clock me-2 text-info" value={stats.totalIncidentsLast24h} />
                            <CardStatistic title="IP Addresses" icon="fas fa-network-wired me-2 text-info" value={stats.totalIpAddresses} />
                            <CardStatistic title="High Risk IPs" icon="fas fa-exclamation-triangle text-warning" value={stats.highRiskIPCount} />
                          </div>
                          <div className="mb-5 row">
                            <div className="col-md-9">
                              <IncidentVectorMap stats={stats} />
                            </div>
                            <div className="col-md-3">
                              <div className="card text-dark shadow-sm">
                                <div className="card-header fs-5 pt-3 bg-white border-0 text-center">Incidents by Country</div>
                                <div className="card-body">
                                  <table className="table-sm table-basic text-dark w-100" style={{ border: 'none' }}>
                                    <thead>
                                      <tr style={{ border: 'none' }}>
                                        <th className="text-start">Country</th>
                                        <th className="text-end">Incidents</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {stats.countryStats.map((countryStat, index) => (
                                        <tr key={index} style={{ border: 'none' }}>
                                          <td className="text-start">{countryStat.countryName}</td>
                                          <td className="text-end">{countryStat.incidentsAmount}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h5 className="text-start fw-light mb-3">Most recent incidents</h5>
                          <div className="card px-3 shadow-sm">
                            <IncidentTable incidents={incidents} />
                          </div>
                        </>
                      ) : (
                        <p>No incidents found.</p>
                      )}
                    </>
                  ) : (
                    <h3>Get started now!</h3>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
