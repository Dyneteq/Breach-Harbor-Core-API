import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AlertContext from '../shared/AlertContext';
import config from '../config/config';

const EmailVerification = () => {
  const { token } = useParams();
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/auth/verify/${token}`, { method: 'GET' })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Failed to verify email');
        }
      })
      .then(message => {
        setAlert({ message: message, type: 'success' });
        navigate('/login', { state: { message: message, type: 'success' } });
      })
      .catch(error => {
        setAlert({ message: error.message, type: 'error' });
        navigate('/login', { state: { message: error.message, type: 'error' } });
      });
  }, [token, setAlert, navigate]);

  return <div>Verifying...</div>;
};

export default EmailVerification;
