import React, { useCallback, useContext, useState, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import config from '../config/config';
import './ThreatSearch.css';
import SearchIPResponse from './SearchIPResponse';
import { useLocation } from 'react-router-dom';
import RecentSearches from './RecentSearches';
import { useParams } from 'react-router-dom';

const IPAddressView = () => {
  const { auth, fetchWithAuth } = useContext(AuthContext);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [initialSearchText, setInitialSearchText] = useState('');
  const [searchedIp, setSearchedIp] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const { ip } = useParams();

  useEffect(() => {
    setInitialSearchText(ip);
  }, [ip]);

  // Simple IP address validation with a regular expression
  const isValidIP = (ip) => {
    const pattern = new RegExp(
      '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    );
    return pattern.test(ip);
  };

  const handleSearch = useCallback(async (searchText) => {
    // Validate the IP address format before making the API call
    if (!isValidIP(searchText)) {
      setError('Invalid IP address');
      setIsLoading(false);
      setIsButtonDisabled(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsButtonDisabled(true);
      setSearchedIp(searchText);
      const startTime = new Date().getTime();

      const response = await fetchWithAuth(`${config.apiBaseUrl}/analyst/get_by_ip_address/${searchText}`);
      const data = await response.json();
      if (response.ok) {
        setResponse(data);
        setError(null);
      } else {
        setError(data.error);
        setResponse(null);
      }

      const endTime = new Date().getTime();
      const timeElapsed = endTime - startTime;
      const minimumDelay = 1000; 
      const remainingDelay = minimumDelay - timeElapsed;

      setTimeout(() => {
        setIsLoading(false);
        setIsButtonDisabled(false);

        setRecentSearches((prevSearches) => [
          {
            searchText,
            isSuccessful: response.ok,
            createdAt: new Date().toISOString(),
          },
          ...prevSearches.slice(0, 9),
        ]);
      }, remainingDelay < 0 ? 0 : remainingDelay);

    } catch (error) {
      console.error('Failed to fetch user:', error);
      setError('Error fetching data from the server');
      setResponse(null);
      setIsLoading(true); 
      setIsButtonDisabled(false);

      setRecentSearches((prevSearches) => [
        {
          searchText,
          isSuccessful: false,
          createdAt: new Date().toISOString(),
        },
        ...prevSearches,
      ]);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const response = await fetchWithAuth(`${config.apiBaseUrl}/user-activity/recentSearches`);
        const data = await response.json();
        setRecentSearches(data);
      } catch (error) {
        console.error('Failed to fetch recent searches:', error);
        // Handle error
      }
    };

    fetchRecentSearches();
  }, [fetchWithAuth]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(searchText);
    }
  };

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get('text');
    if (searchParam) {
      setInitialSearchText(searchParam);
    }
  }, [location.search]);

  useEffect(() => {
    setSearchText(initialSearchText);
  }, [initialSearchText]);

  useEffect(() => {
    if (initialSearchText !== '') {
      handleSearch(initialSearchText);
    }
  }, [initialSearchText, handleSearch]);

  return (
    <div className="d-flex flex-column vh-100">
      <div className="d-flex flex-grow-1">

        <Sidebar auth={auth} showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />

        <div className="d-flex flex-column flex-grow-1">
          <Navbar />

          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-center px-5">

              <div className="container-fluid text-start mt-5">
                <h2 className="mb-4 fw-light">IP Address</h2>
                <div className="row mb-4">
                  <div className="col-md-8 mb-3 mb-md-0">
                    <div className="card p-3">
                      <div className="card-body">
                        <div className="mb-3 input-group input-group-lg pt-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search IP Address"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSearch(searchText)}
                            disabled={isButtonDisabled}
                          >
                            <i className="fas fa-search"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-8 mb-3 mb-md-0">
                    <div className="card p-3">
                      <div className="card-body">
                        <div className="col-12 mt-4">
                          <SearchIPResponse
                            response={response}
                            error={error}
                            isLoading={isLoading}
                            ipAddress={searchedIp}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    {!isLoading && response && response.incidents && response.incidents.totalAmount > 50 && (
                      <div className="alert alert-danger fs-5 fw-light">
                        <i className="fas fa-fire fs-3 me-3"></i>
                        This is a High Risk IP Address
                      </div>
                    )}
                    <div className="card p-3">
                      <div className="card-title mt-3 mb-3 px-3 d-flex align-items-center justify-content-between">
                        <h4>Recent Searches</h4>
                      </div>
                      <div className="card-body">
                        <div className="d-flex flex-column">
                          <RecentSearches recentSearches={recentSearches} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPAddressView;
