import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ auth, showSidebar, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getClassName = (path) => {
    let baseClasses = "nav-item rounded";
    return isActive(path) ? `${baseClasses} bg-light text-dark` : baseClasses;
  };

  return (
    <div className={`d-flex flex-column ${showSidebar ? '' : 'w-0'} overflow-hidden bg-black text-light`} style={{ maxWidth: '320px', width: showSidebar ? '30%' : '0', height: '100%' }}>
      <div className="h-100 flex-grow-1">
        <Link className="navbar-brand text-center ms-0 mb-4 px-4 d-block border-bottom border-dark" to="/" style={{ minHeight: '65px', paddingTop: '10px'}}>
          BREACH :: HARBOR
        </Link>
        <ul className="list-unstyled py-3 px-4">
          {auth ? (
            <>
              <li className={getClassName('/dashboard')}>
                <Link className="nav-link d-flex align-items-center mb-2 py-2 px-3" to="/dashboard">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-tachometer-alt"></i>
                  </span>
                  Dashboard
                </Link>
              </li>
              <li className={getClassName('/incidents')}>
                <Link className="nav-link d-flex align-items-center mb-2 py-2 px-3" to="/incidents">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-fire"></i>
                  </span>
                  Incidents
                </Link>
              </li>
              <li className={getClassName('/ip-addresses')}>
                <Link className="nav-link d-flex align-items-center mb-2 py-2 px-3" to="/ip-addresses">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-network-wired"></i>
                  </span>
                  IP Address DB
                </Link>
              </li>
              <li className={getClassName('/collector')}>
                <Link className="nav-link d-flex align-items-center mb-2 py-2 px-3" to="/collector">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-database"></i>
                  </span>
                  Collectors
                </Link>
              </li>
              <li className={getClassName('/defenders')}>
                <Link className="nav-link d-flex disabled text-secondary align-items-center mb-2 py-2 px-3" to="/defenders">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-shield-alt"></i>
                  </span>
                  Defenders
                </Link>
              </li>
              <li className={getClassName('/notifications')}>
                <Link className="nav-link d-flex align-items-center mb-2 py-2 px-3" to="/notifications">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-bell"></i>
                  </span>
                  Notifications
                </Link>
              </li>
              <li className={getClassName('/report')}>
                <Link className="nav-link d-flex disabled text-secondary align-items-center mb-2 py-2 px-3" to="/report">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-file-alt"></i>
                  </span>
                  Reporting
                </Link>
              </li>
              <li className={getClassName('/cloudsync')}>
                <Link className="nav-link d-flex disabled text-secondary align-items-center mb-2 py-2 px-3" to="/cloudsync">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-cloud-download-alt"></i>
                  </span>
                  CloudSync
                </Link>
              </li>
              <li className={getClassName('/help')}>
                <Link className="nav-link d-flex disabled text-secondary align-items-center mb-2 py-2 px-3" to="/help">
                  <span className="d-flex justify-content-center align-items-center me-2" style={{ width: '24px' }}>
                    <i className="fas fa-question-circle"></i>
                  </span>
                  Help & Support
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
