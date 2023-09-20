import React, { useContext, useEffect } from 'react';
import AlertContext from './AlertContext';

const Alert = () => {
  const { alert, setAlert } = useContext(AlertContext);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [alert, setAlert]);

  if (!alert.message) {
    return null;
  }

  const alertContainerStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.75rem',
    zIndex: '9999',
  };

  const alertStyle = {
    width: '50%',
  };

  return (
    <div style={alertContainerStyle}>
      <div className={`alert alert-${alert.type} mt-3 shadow`} style={alertStyle} role="alert">
        {alert.message}
      </div>
    </div>
  );
};

export default Alert;
