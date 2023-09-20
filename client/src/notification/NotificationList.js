import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import HumanizeDateTime from '../utils/HumanizeDateTime';
import config from '../config/config';

const NotificationList = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetchWithAuth(`${config.apiBaseUrl}/collector/notification/get_all?limit=30`);
        const data = await response.json();

        if (response.ok) {
          setNotifications(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [fetchWithAuth]);

  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">

        {/* Sidebar */}
        <Sidebar auth={auth} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />

        <div className="d-flex flex-column flex-grow-1">
          <Navbar />

          {/* Main Content */}
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-center px-5">
              <div className="container-fluid text-start mt-5">
                <h2 className="mb-5 fw-light">Notifications</h2>
                <div className="row mb-4">
                  <div className="col-md-12 mb-3 mb-md-0">
                    <div className='table-responsive px-4 bg-white rounded'>
                      {isLoading ? <div>Loading...</div> : (
                        <table className="table table-striped mt-4" style={{ background: '#000 !important' }}>
                          <thead>
                            <tr>
                              <th className="text-center">Read</th>
                              <th>Message</th>
                              <th>IP Address</th>
                              <th>Collector</th>
                              <th>Created At</th>
                              <th>Severity</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {notifications.map((notification, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  <i
                                    className={`fa fa-check cursor-pointer ${notification.is_read ? 'text-success opacity-100' : 'text-secondary opacity-50'}`}
                                    onClick={() => {/* handle toggle read logic here */ }}
                                  />
                                </td>
                                <td>{notification.message}</td>
                                <td>
                                  <Link className="text-decoration-none" to={`/ip-address/${notification.incident_detail.ip_address_str}`}>
                                    {notification.incident_detail.ip_address_str}
                                  </Link>
                                </td>
                                <td>
                                  <Link className="text-decoration-none" to={`/collector/${notification.incident_detail.collector_name}`}>
                                    {notification.incident_detail.collector_name}
                                  </Link>
                                </td>
                                <td><HumanizeDateTime dateTime={notification.created_at} /></td>
                                <td>{notification.severity}</td>
                                <td>
                                  <Link to={`/notification/${notification.id}`}>
                                    <i className="fas fa-eye text-secondary"></i>
                                  </Link>

                                  <Link className="ms-2" to={`/notification/${notification.id}`}>
                                    <i className="fas fa-trash text-secondary"></i>
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

export default NotificationList;
