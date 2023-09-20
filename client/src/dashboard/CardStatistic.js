import React from 'react';

const CardStatistic = ({ title, icon, value }) => {
  return (
    <div className="col-md-3 mb-3 mb-md-0">
      <div className="card pt-3 pb-2 bg-white text-dark text-center">
        <div className="card-body">
          <h5 className="card-title mb-2 fw-light"> <i className={`fas ${icon} me-2 opacity-50`}></i> {title}</h5>
          <p className="card-text fs-2">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default CardStatistic;