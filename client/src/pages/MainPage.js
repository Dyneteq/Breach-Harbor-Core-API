import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../shared/Navbar';
import config from '../config/config';
import AlertContext from '../shared/AlertContext';

const MainPage = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(!auth);
  const [readiness, setReadiness] = useState(null);

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
        setShowForm(false);
        setAlert({ message: 'Thank you! Please check your email for login credentials.', type: 'success' });
      } else {
        setAlert({ message: data.message || 'An error occurred while registering your email.', type: 'danger' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ message: 'An unexpected error occurred.', type: 'error' });
    }
  };

  useEffect(() => {
    setShowForm(!auth);
    if (auth) {
      fetchWithAuth(`${config.apiBaseUrl}/health/readiness`, {}, true)
        .then((response) => response.json())
        .then((data) => setReadiness(data))
        .catch((error) => console.error('Error:', error));
    }
  }, [auth, fetchWithAuth]);

  return (
    <div>
      <Navbar />

      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="container text-center">
          {auth ? (
            <>
              <h3>Welcome, human!</h3>
              {readiness ? (
                <h4>Readiness status: {readiness.status}</h4>
              ) : (
                <h4>Readiness status: Loading...</h4>
              )}
            </>
          ) : (
            <h3>Get started now!</h3>
          )}

          {showForm && (
            <form onSubmit={handleEmailSubmit} className="mt-5 d-flex flex-column flex-sm-row justify-content-sm-center align-items-stretch">
              <input
                type="email"
                className="form-control bg-dark text-light py-3 px-5 fs-5 border border-dark flex-grow-1 flex-sm-grow-0 mb-2 mb-sm-0 me-sm-2"
                style={{ maxWidth: '900px' }}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="User's email"
                aria-describedby="btn-get-started"
                required
              />
              <button type="submit" className="btn btn-primary btn-get-started fs-5 py-3 px-5 flex-grow-1">
                Get Started
              </button>
            </form>


          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
