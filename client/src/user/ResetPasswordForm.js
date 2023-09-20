import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AlertContext from '../shared/AlertContext';
import config from '../config/config';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { setAlert } = useContext(AlertContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Extract the reset token from the URL query parameters
    const resetToken = location.pathname.split('/').pop();

    const response = await fetch(`${config.apiBaseUrl}/user/updatePassword`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, resetToken }),
    });

    const data = await response.json();

    if (response.ok) {
      navigate('/login', { state: { message: 'Password has been successfully reset' } });
    } else {
      setAlert({ message: data.message, type: 'warning' });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card shadow" style={{ width: '30rem' }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h5 className="card-title text-center mb-4 mt-3">Reset Password</h5>
            <hr />
            <div className="py-3">
              <div className="mb-4">
                <label className="form-label">
                  New Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Apply Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
