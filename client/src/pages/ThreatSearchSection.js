import React from 'react';
import 'prismjs/themes/prism.css';
import image from '../images/breach_harbor_threatsearch_1.png';


const ThreatSearchSection = () => {
  return (
    <div id="threat-search" className="text-dark text-center rounded" style={{ marginTop: '100px', padding: '50px 40px', background: '#ccc' }}>
      <h1>ThreatSearch</h1>
      <hr />
      <div className="mt-5 mb-5 row">
        <div className="col-6 d-flex flex-column pt-5 mt-5">
          <h2 className="text-start">Leveraging Enemy Insights for Superior Threat Response</h2>
          <p className="mt-4 text-start pe-4" style={{ fontSize: '1.2rem', fontWeight: 400 }}>
            Our ThreatSearch feature revolutionizes how businesses approach cybersecurity. It empowers users to search 
            for an IP address and retrieve detailed security data. This includes information about security incidents, 
            location, DNS data, and other specific incident data related to the searched IP address.
          </p>

          <p className="mt-3 text-start pe-4" style={{ fontSize: '1.2rem', fontWeight: 400 }}>
            By providing comprehensive security intelligence, ThreatSearch equips you with the knowledge necessary 
            to identify and respond to potential threats quickly and efficiently. Its intuitive interface and rich 
            data output make it an invaluable tool for security analysis and response planning. Secure your digital 
            assets better with ThreatSearch.
          </p>
        </div>
        <div className="col-6">
          <img src={image} alt="Breach Harbor Thread Search" className="img-fluid"/> 
        </div>
      </div>
    </div>
  );
};

export default ThreatSearchSection;
