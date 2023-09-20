import React from 'react';

const MissionSection = () => {
  return (
    <div id="mission" className="text-dark text-center rounded" style={{ marginTop: '100px', padding: '50px 40px', background: '#ccc' }}>
      <h1>OUR MISSION</h1>
      <hr />
      <div className="mt-5 mb-5 d-block">
        <div
          style={{
            fontSize: '20px',
            lineHeight: '36px',
            width: '75%',
            justifyContent: 'center',
            display: 'block',
            margin: '0 auto',
            fontWeight: 400,
          }}
        >
          <p>
            At BREACH :: HARBOR, our mission is to provide businesses with real-time, actionable insights into emerging
            cyber threats. We leverage cutting-edge technology to collect and analyze data from attackers, empowering
            organizations to proactively defend their digital assets. Our dedicated team is committed to delivering
            innovative cybersecurity solutions that help businesses stay ahead of evolving threats, strengthen their
            security posture, and safeguard their valuable information. We are driven by our passion for protecting
            businesses and enabling a secure digital future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;
