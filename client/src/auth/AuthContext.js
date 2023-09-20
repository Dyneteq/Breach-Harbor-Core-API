import React, { createContext, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertContext from '../shared/AlertContext';
import config from '../config/config';

const AuthContext = createContext();

const getStoredAuth = () => {
  const authData = localStorage.getItem('auth');
  if (authData) {
    try {
      return JSON.parse(authData);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const storeAuth = (auth) => {
  localStorage.setItem('auth', JSON.stringify(auth));
};

const removeStoredAuth = () => {
  localStorage.removeItem('auth');
};

const AuthProvider = ({ children }) => {
  const [auth, setAuthState] = useState(getStoredAuth);
  const navigate = useNavigate();
  const { setAlert } = useContext(AlertContext);
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: auth.refresh })
      });

      if (!response.ok) throw new Error(`Failed to refresh token with status: ${response.status}`);

      const responseData = await response.json();
      const updatedAuth = {
        access: responseData.access,
        refresh: responseData.refresh || auth.refresh,
        id: auth.id,
        username: auth.username,
        first_name:auth.first_name,
        last_name: auth.last_name,
        email: auth.email
      };
      storeAuth(updatedAuth);
      setAuthState(updatedAuth);
      return updatedAuth.access;

    } catch (error) {
      removeStoredAuth();
      setIsLoggedIn(false);
      setAuthState(null);
      return null;
    }
  }, [auth]);

  const setAuth = (updatedAuth) => {
    if (updatedAuth) {
      storeAuth(updatedAuth);
      setIsLoggedIn(true);
    } else {
      removeStoredAuth();
      setIsLoggedIn(false);
    }
    setAuthState(updatedAuth);
  };

  const handleLogout = () => {
    setAuth(null);
    setAlert({ message: 'Logged out successfully', type: 'success' });
    navigate('/', { state: { message: 'Logged out successfully', type: 'success' } });
  };

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const headers = isLoggedIn ? { ...options.headers, Authorization: `Bearer ${auth?.access}` } : options.headers;
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 && isLoggedIn) {
      const newToken = await refresh();
      if (!newToken) {
        return response;
      }

      const newResponse = await fetch(url, { ...options, headers: { ...headers, Authorization: `Bearer ${newToken}` } });

      if (newResponse.status === 401) {
        setAlert({ message: 'Unauthenticated', type: 'error' });
        navigate('/login', { state: { message: 'Unauthenticated', type: 'error' } });
      }
      return newResponse;
    }

    if (response.status === 401) {
      setAlert({ message: 'Unauthenticated', type: 'error' });
      navigate('/login', { state: { message: 'Unauthenticated', type: 'error' } });
    }

    return response;
  }, [auth, isLoggedIn, refresh, navigate, setAlert]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, fetchWithAuth, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
