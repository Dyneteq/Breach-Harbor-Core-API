import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import HumanizeDateTime from '../../utils/HumanizeDateTime';
import IncidentTypeBadge from '../../dashboard/IncidentTypeBadge';

const IncidentsSection = ({ incident }) => {
  const { totalAmount, latest24hAmount, lastFive, hourly } = incident;

  // Ref for the chart canvas element
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Update the chart when the component mounts or the incident prop changes
  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      // Prepare the data for the chart
      const chartData = {
        labels: hourly.map(({ hour }) => hour),
        datasets: [
          {
            label: 'Incidents per Hour',
            data: hourly.map(({ incidentsAmount }) => incidentsAmount),
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: '#0d6efd',
            borderWidth: 1,
            fill: true,
          },
        ],
      };

      // Create the chart
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              precision: 0,
              suggestedMax: Math.max(...chartData.datasets[0].data) + 5,
            },
          },
        },
      });
    }
  }, [hourly]);

  return (
    <div className="px-1 mt-5">
      <h5 className="text-start">Incidents</h5>
      <div className="row mx-0">
        <div className="col-md-12 mt-4">
          <div className="row">
            <div className="col-md-4">
              <div className="card py-1 mb-2">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1 fw-light"><i className="far fa-calendar-alt me-4 opacity-50 fs-2"></i>All incidents</h5>
                  </div>
                  <div>
                    <span className="fs-2">{totalAmount}</span>
                  </div>
                </div>
              </div>
              <div className="card py-1">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1 fw-light"><i className="fas fa-chart-line me-4 opacity-50 fs-2"></i>24h incidents</h5>
                  </div>
                  <div>
                    <span className="fs-2">{latest24hAmount}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <canvas className="p-2 border-secondary rounded" ref={chartRef}></canvas>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              {lastFive.length > 0 ? (
                <table className="table table-striped table-sm" style={{ background: '#000 !important' }}>
                  <thead>
                    <tr>
                      <th>Incident Type</th>
                      <th>Collector</th>
                      <th>Location</th>
                      <th>Happened At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastFive.map((incident, index) => (
                      <tr key={index}>
                        <td><IncidentTypeBadge incidentType={incident.incident_type} /></td>
                        <td>
                          <Link className="text-decoration-none" to={`/collector/${incident.collector_name}`}>
                            {incident.collector_name}
                          </Link>
                        </td>
                        <td>
                          {incident.location_address ?
                            incident.location_address : (
                              <span>-</span>
                            )}
                        </td>
                        <td><HumanizeDateTime dateTime={incident.happened_at} /></td>
                        <td>
                          <Link to={`/incident/${incident.id}`}>
                            <i className="fas fa-search"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-light" role="alert">
                  No incidents found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentsSection;
