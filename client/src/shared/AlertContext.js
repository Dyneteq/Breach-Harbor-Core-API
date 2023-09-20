import React from 'react';

const AlertContext = React.createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = React.useState({ message: '', type: '' });

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;