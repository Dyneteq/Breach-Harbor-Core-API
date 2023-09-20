import React from 'react';
import { Link } from 'react-router-dom';

const RecentSearches = ({ recentSearches }) => {
  const renderIsSuccessfulBadge = (isSuccessful) => {
    return isSuccessful 
      ? <i className="far fa-circle text-success"></i> 
      : <i className="far fa-circle text-danger"></i>;
  };

  const renderApiSearchIcon = (isApiSearch) => {
    return isApiSearch
      ? <i className="fas fa-code text-primary ms-2"></i>
      : null;
  };

  return (
    <div className="d-flex flex-column">
      {recentSearches.map((search, index) => (
        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center col">
            {renderIsSuccessfulBadge(search.isSuccessful)}
            {renderApiSearchIcon(search.isApiSearch)}
          </div>
          <div className="flex-grow-1 mx-3 text-end">
            {search.searchText}
          </div>
          <div className="text-end text-secondary">{new Date(search.createdAt).toLocaleString()}</div>
          <div>
            <Link to={`/threat-search?text=${search.searchText}`}>
              <i className="fas fa-redo ms-2"></i>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentSearches;
