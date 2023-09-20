import React from 'react';
import IPAddressSection from './sections/IPAddressSection';
import IncidentsSection from './sections/IncidentsSection';
import LocationSection from './sections/LocationSection';
import DNSSection from './sections/DNSSection';

const SearchIPResponse = ({ response, error, isLoading, ipAddress }) => {
  return (
    <div>
      {error && !isLoading && (
        <div className="alert alert-danger fs-6" role="alert">
          <i className="fas fa-exclamation-circle fa-lg me-3"></i>
          {error}
        </div>
      )}

      {isLoading && (
        <div className="alert alert-primary d-flex align-items-center justify-content-center fs-6" role="alert">
          <div className="spinner-border me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Gathering information about {ipAddress}...
        </div>
      )}

      {response && !isLoading && !error && (
        <>
          <IncidentsSection incident={response.incidents} />
          <IPAddressSection ipAddress={response.ipAddress} />
          <LocationSection location={response.location} />
          <DNSSection dns={response.dns} />
        </>
      )}
    </div>
  );
};

export default SearchIPResponse;
