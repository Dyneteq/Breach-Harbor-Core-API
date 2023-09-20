import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import AlertContext from '../shared/AlertContext';
import './Navbar.css';

const Navbar = ({ isLandingPage }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    setAlert({ message: 'Logged out successfully', type: 'success' });
    navigate('/', { state: { message: 'Logged out successfully', type: 'success' } });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isLandingPage ? 'navbar-dark' : 'navbar-secondary bg-white'}`}>
      <div className="container-fluid px-4">
        <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse ms-5" id="navbarNav">
          <ul className="navbar-nav">
          </ul>
          <ul className="navbar-nav ms-auto me-2">
            {auth ? (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link text-decoration-none d-flex align-items-center"
                    id="navbarDropdown"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        <i className="fas fa-xs fa-circle text-success"></i>
                      </span>
                      {auth.email}
                    </div>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <Link className="dropdown-item" to="/user/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => scrollToSection('threat-api')}
                  >
                    Threat API
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => scrollToSection('threat-search')}
                  >
                    ThreatSearch
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => scrollToSection('mission')}
                  >
                    Mission
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => scrollToSection('services')}
                  >
                    Services
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    onClick={() => scrollToSection('contact')}
                  >
                    Contact
                  </button>
                </li>
                <li className="nav-item me-4">
                  <Link className="nav-link" to="/register">
                    Sign up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary px-4 fw-bold" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
