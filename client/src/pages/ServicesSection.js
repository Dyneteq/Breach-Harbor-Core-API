import React from 'react';

const ServicesSection = () => {
  return (
    <div id="services" className="text-dark text-center rounded" style={{ marginTop: '100px', padding: '50px 40px', background: '#ccc' }}>
      <h1>OUR SERVICES</h1>
      <hr />
      <div className="row mt-5 pt-3">
        <div className="col-md-6 px-5">
          <h1 style={{ fontSize: '4rem' }} className="mb-4">
            <i className="fas fa-shield-alt glow-icon"></i>
          </h1>
          <h4 style={{ fontWeight: 800 }}>Real-Time Threat Intelligence</h4>
          <p className="mt-4" style={{ fontSize: '16px', fontWeight: 300 }}>
            Stay one step ahead of cyber attackers with our real-time data insights, enabling proactive security measures to
            mitigate emerging threats.
          </p>
        </div>
        <div className="col-md-6 px-5">
          <h1 style={{ fontSize: '4rem' }} className="mb-4">
            <i className="fas fa-lightbulb glow-icon"></i>
          </h1>
          <h4 style={{ fontWeight: 800 }}>Actionable Insights</h4>
          <p className="mt-4" style={{ fontSize: '16px', fontWeight: 300 }}>
            Gain valuable and actionable insights into the tactics and techniques used by attackers, empowering your organization
            to strengthen its defenses and minimize the risk of successful breaches.
          </p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6 px-5">
          <h1 style={{ fontSize: '4rem' }} className="mb-4">
            <i className="fas fa-rocket glow-icon"></i>
          </h1>
          <h4 style={{ fontWeight: 800 }}>Enhanced Cyber Defense</h4>
          <p className="mt-4" style={{ fontSize: '16px', fontWeight: 300 }}>
            Strengthen your network's resilience and protect your invaluable digital assets with our cutting-edge cybersecurity
            platform, designed to deliver comprehensive protection and enable you to proactively defend against cyber threats.
          </p>
        </div>
        <div className="col-md-6 px-5">
          <h1 style={{ fontSize: '4rem' }} className="mb-4">
            <i className="fas fa-eye glow-icon"></i>
          </h1>
          <h4 style={{ fontWeight: 800 }}>Advanced Threat Monitoring</h4>
          <p className="mt-4" style={{ fontSize: '16px', fontWeight: 300 }}>
            Gain a competitive edge with our advanced threat monitoring capabilities. Stay informed about potential security risks
            and vulnerabilities, allowing you to take timely actions to safeguard your business operations and maintain customer
            trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
