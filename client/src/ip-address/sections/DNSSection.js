import React from 'react';

const DNSSection = ({ dns }) => {
  return (
    <div className="px-1 mt-5">
      <h5 className="mb-3 text-start">DNS</h5>
      {dns ? dns : (
        <div className="alert alert-light" role="alert">
          Reverse lookup hosts not found
        </div>
      )}
    </div>
  );
};

export default DNSSection;
