import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlertContext from '../shared/AlertContext';
import config from '../config/config';

const RegisterForm = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const { setAlert } = useContext(AlertContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password, email })
    });

    const data = await response.json();

    if (response.ok) {
      navigate('/login', { state: { message: 'Please check your email for verification' } });
    } else {
      setAlert({ message: data.message, type: 'warning' });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: '100vh' }}>
      <div className="card shadow" style={{ width: '30rem' }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h3 className="text-center w-100 py-3">
              <Link className="navbar-brand align-items-center" to="/" >
                <span className="fw-bold">BREACH :: HARBOR</span>
              </Link>
            </h3>
            <h5 className="card-title text-center mb-4 mt-3">Create your account</h5>
            <hr></hr>
            <div className="py-3">
              <div className="mb-4">
                <label className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  className="form-control w-100"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Create a free account</button>
            <div className="mt-3">
              <small>Already a user? <Link to="/login">Login</Link></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
