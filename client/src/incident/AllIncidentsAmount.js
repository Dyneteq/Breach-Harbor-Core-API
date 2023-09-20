import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import config from '../config/config';

const AllIncidentsAmount = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [allIncidentsAmount, setallIncidentsAmount] = useState('');

  useEffect(() => {
    const fetchallIncidentsAmountAmount = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/incident/getAmount`, {}, true);
        const data = await response.json();
        setallIncidentsAmount(data.all);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchallIncidentsAmountAmount(); // Fetch initial incidents

    const interval = setInterval(fetchallIncidentsAmountAmount, 3000); // Fetch incidents every 3 seconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [fetchWithAuth]);

  return allIncidentsAmount ? (
    <div className="d-flex align-items-center mt-5">
      <h1 className="me-2">{allIncidentsAmount}</h1>
      <p className="fs-5 fw-light mb-0">incidents logged</p>
    </div>
  ) : (
    <p>No incidents logged.</p>
  );
};

export default AllIncidentsAmount;
