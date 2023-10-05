import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import config from "../config/config";
import Navbar from "../shared/Navbar";
import Sidebar from "../shared/Sidebar";
import { Link } from "react-router-dom";
import HumanizeDateTime from "../utils/HumanizeDateTime";
import CollectorAddNewModal from "./CollectorAddNewModal";

const CollectorList = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const [collectors, setCollectors] = useState([]);
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const getCollectors = useCallback(async () => {
    try {
      const response = await fetchWithAuth(
        `${config.apiBaseUrl}/collector/get_all`
      );
      const rawData = await response.json();
      const data = rawData.map((collector) => ({
        ...collector,
        ipAddress: collector.ip_address,
        lastOnlineAt: collector.last_online_at,
      }));
      setCollectors(data);
    } catch (error) {
      console.error("Failed to fetch collectors:", error);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    getCollectors();

    const pollInterval = setInterval(() => {
      getCollectors();
    }, 5000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [getCollectors]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchWithAuth(
        `${config.apiBaseUrl}/collector/create_or_update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, ip_address: ipAddress }),
        }
      );
      const data = await response.json();
      setCollectors([...collectors, data]);
      setName("");
      setIpAddress("");
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to create or update collector:", error);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const renderIsOnlineIcon = (lastOnlineAt) => {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const isOnline = new Date(lastOnlineAt) > oneMinuteAgo;

    if (isOnline) {
      return (
        <span className="ms-3">
          <i className="fas fa-circle text-success"></i>
        </span>
      );
    } else {
      return (
        <span className="ms-3">
          <i className="fas fa-circle text-danger"></i>
        </span>
      );
    }
  };

  const renderIsVerifiedIcon = (lastOnlineAt) => {
    if (lastOnlineAt) {
      return (
        <span className="ms-3">
          <i className="fas fa-check-circle text-success"></i>
        </span>
      );
    } else {
      return (
        <span className="ms-3">
          <i className="fas fa-clock text-secondary opacity-50"></i>
        </span>
      );
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <Sidebar
          auth={auth}
          showSidebar={showSidebar}
          toggleSidebar={() => setShowSidebar(!showSidebar)}
        />

        <div className="d-flex flex-column flex-grow-1">
          <Navbar />

          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-center px-5">
              <div className="container-fluid text-start mt-5">
                {auth ? (
                  <>
                    <h2 className="mb-5 fw-light">Collectors</h2>
                    {collectors.length > 0 ? (
                      <div className="col-md-12">
                        <div className="table-responsive px-4 bg-white rounded mb-4">
                          <table className="table table-hover mt-4">
                            <thead>
                              <tr>
                                <th scope="col" style={{ width: "60px" }}>
                                  Status
                                </th>
                                <th scope="col" style={{ width: "100px" }}>
                                  Verified
                                </th>
                                <th scope="col">Name</th>
                                <th scope="col">IP Address</th>
                                <th scope="col">Last Seen Online</th>
                              </tr>
                            </thead>
                            <tbody>
                              {collectors.map((collector, index) => (
                                <tr key={collector.id}>
                                  <td>
                                    {renderIsOnlineIcon(
                                      collector.last_online_at
                                    )}
                                  </td>
                                  <td>
                                    {renderIsVerifiedIcon(
                                      collector.last_online_at
                                    )}
                                  </td>
                                  <td>
                                    <Link
                                      className="text-decoration-none fw-bold text-dark"
                                      to={`/collector/${collector.name}`}
                                    >
                                      {collector.name}
                                    </Link>
                                  </td>
                                  <td>
                                    <Link
                                      className="text-decoration-none"
                                      to={`/ip-address/${collector.ipAddress}`}
                                    >
                                      {collector.ip_address}
                                    </Link>
                                  </td>
                                  <td>
                                    <HumanizeDateTime
                                      dateTime={collector.last_online_at}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p>No collectors found.</p>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleModalOpen}
                    >
                      Add a new collector
                    </button>

                    <CollectorAddNewModal
                      isOpen={isModalOpen}
                      onClose={handleModalClose}
                      onSubmit={handleSubmit}
                    />
                  </>
                ) : (
                  <h3>Not authorised</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorList;
