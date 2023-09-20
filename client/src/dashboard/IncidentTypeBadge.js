import React from 'react';

const IncidentTypeBadge = ({ incidentType }) => {
  const getLabel = (incidentType) => {
    switch (incidentType) {
      case 'BH-SSH':
        return 'SSH';
      case 'BH-HTTP':
        return 'HTTP';
      default:
        return 'OTHER';
    }
  };

  const label = getLabel(incidentType);

  const getColorClass = (incidentType) => {
    switch (incidentType) {
      case 'BH-SSH':
        return 'bg-primary';
      case 'BH-HTTP':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  const colorClass = getColorClass(incidentType);

  return <span className={`badge ${colorClass}`}>{label}</span>;
};

export default IncidentTypeBadge;
