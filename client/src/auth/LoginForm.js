import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import AlertContext from '../shared/AlertContext';
import config from '../config/config';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setAuth } = useContext(AuthContext);
  const { setAlert } = useContext(AlertContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setAlert({ message: location.state.message, type: location.state.type || 'warning' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    }
  }, [location, setAlert]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    const data = await response.json();
  
    if (response.ok) {
      const authData = { ...data };
      localStorage.setItem('auth', JSON.stringify(authData));
      setAuth(authData);

      const userResponse = await fetch(`${config.apiBaseUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${authData.access}`,
          'Content-Type': 'application/json'
        }
      });
      
      const userData = await userResponse.json();
  
      if (userResponse.ok) {
        const updatedAuthData = {
          ...authData,
          ...userData,
        };
  
        localStorage.setItem('auth', JSON.stringify(updatedAuthData));
        setAuth(updatedAuthData);
  
        setAlert({ message: 'Logged in successfully', type: 'success' });
        navigate('/dashboard', { state: { message: 'Logged in successfully', type: 'success' } });
      } else {
        setAlert({ message: userData.message, type: 'danger' });
        setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      }
    } else {
      setAlert({ message: data.message, type: 'danger' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    }
  };
  

  return (
    <>
      <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: '100vh' }}>
        <div className="card shadow" style={{ width: '30rem' }}>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center w-100 py-3">
                <Link className="navbar-brand align-items-center" to="/" >
                  <span className="fw-bold">BREACH :: HARBOR</span>
                </Link>
              </h3>

              <h5 className="card-title text-center mb-4 mt-3">Login to your account</h5>
              <hr></hr>
              <div className="py-3">
                <div className="mb-4">
                  <label className="form-label">Username:</label>
                  <input
                    type="text"
                    className="form-control w-100"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
              <div className="mt-3">
                <small><Link to="/request-password-reset">Reset Password</Link> or <Link to="/register">Sign up</Link></small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
