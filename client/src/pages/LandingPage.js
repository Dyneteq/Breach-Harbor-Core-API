import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../shared/Navbar';
import config from '../config/config';
import AlertContext from '../shared/AlertContext';
import './LandingPage.css';
import ThreatAPISection from './ThreatAPISection';
import MissionSection from './MissionSection';
import ServicesSection from './ServicesSection';
import ContactSection from './ContactSection';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import AllIncidentsAmount from '../incident/AllIncidentsAmount';
import ThreatSearchSection from './ThreatSearchSection';
import backgroundImage from '../images/background_network_dark.jpeg';

const LandingPage = () => {
  const { auth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [email, setEmail] = useState('');
  const location = useLocation();

  const navigate = useNavigate();
  const anchorRef = useRef(null); // Reference to the anchor element
  const isLandingPage = location.pathname === '/';

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/registerEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setAlert({ message: 'Thank you! Please check your email for login credentials.', type: 'success' });
      } else {
        setAlert({ message: data.message || 'An error occurred while registering your email.', type: 'danger' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ message: 'An unexpected error occurred.', type: 'error' });
    }

    // Scroll to the anchor element after the form submission
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (auth) {
      navigate('/dashboard');
    }
  }, [auth, navigate]);

  return (
    <div>

      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container-fluid text-center">
          <Navbar isLandingPage={isLandingPage} />
          <div ref={anchorRef} className="col-12 d-flex align-items-top justify-content-center flex-column pt-5">
            <div className="text-center text-light" style={{ fontSize: '2.5rem', fontWeight: 600, marginTop: '150px' }}>
              Real-time cyber-threat insights for proactive security
            </div>
            <div className="text-center text-light" style={{ fontSize: '1.5rem', fontWeight: 300, marginTop: '20px' }}>
              In a digital world teeming with cyber threats, Breach Harbor is your first line of defense.
              We safeguard your business with real-time monitoring, deep threat analysis, and swift action - providing
              security and peace of mind at every moment.
            </div>
          </div>

          <div className="d-flex flex-column align-items-center mt-4 text-light">
            <AllIncidentsAmount />
          </div>

          <div className="col-12 mt-3 align-items-center justify-content-center flex-column vh-100">
            <form onSubmit={handleEmailSubmit} className="row justify-content-center">
              <div className="col-12 col-sm-9 col-md-8">
                <div className="row">
                  <div className="col">
                    <input
                      type="email"
                      className="form-control text-light py-2 px-3 fs-5 border border-primary mb-2"
                      style={{ maxWidth: '100%', backgroundColor: '#444' }}
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="User's email"
                      aria-describedby="btn-get-started"
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn btn-primary btn-get-started fw-light fs-5 py-2 px-5"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* The remaining content of the page goes here without the background image. */}
      <div className="container">
        <div className="row text-light">
          <div className="col-12">
            <ThreatAPISection />
            <ThreatSearchSection />
            <MissionSection />
            <ServicesSection />
            <ContactSection />
          </div>
        </div>
      </div>
    </div>
  );

};

export default LandingPage;
