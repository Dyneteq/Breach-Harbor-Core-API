import React from 'react';
import 'prismjs/themes/prism.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ThreatAPISection = () => {
  return (
    <div id="threat-api" className="text-dark text-center rounded" style={{ marginTop: '100px', padding: '50px 40px', background: '#ccc' }}>
      <h1>Threat API</h1>
      <hr />
      <div className="mt-5 mb-5 row">
        <div className="col-6 d-flex flex-column pt-5 mt-5">
          <h2 className="text-start">Enhancing Security with Seamless Integration</h2>
          <p className="mt-4 text-start pe-4" style={{ fontSize: '1.2rem', fontWeight: 400 }}>
            The Threat API service allows you to seamlessly integrate BreachHarbor's robust security features into your own applications. 
            By enabling the source enumeration, you are equipped with a powerful tool to detect and prevent potential breaches.
          </p>

          <p className="mt-3 text-start pe-4" style={{ fontSize: '1.2rem', fontWeight: 400 }}>
            The Threat API feeds your application with real-time, actionable data on potential threats. 
            With data on attacker IPs, methods of attack, and geographical locations, you're granted a comprehensive understanding of the threat landscape. 
            The Threat API service is an essential component for any application looking to enhance its proactive cybersecurity measures and secure its digital future.
          </p>
        </div>
        <div className="col-6 code-block">
          <SyntaxHighlighter language="json" style={atomDark}>
            {`
      {
        ip: "218.2.3.135",
        cidr: "218.2.3.0/24",
        hostname: "this-is-an-example.com",
        features: {
          bot: true,
          malware: false,
          tor: false,
          proxy: true,
          spyware: false,
          spider: false,
          vpn: false,
          bruteForce": true
        },
        services: {
          ftp: false,
          ssh: true,
          rdp: false,
          sip: false,
          ...
        },
        location: {
          country: "Greece",
          region: "Attiki",
          city: "Athens"
        },
        lastSeenAt: "2023-03-25T13:57:34.036Z",
        score: 15,
        isp: {
          name: "BOTCOM",
          domain: "botcom.somewhere.com"
        },
        ...
      },
      {
        ...
      }
            `}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default ThreatAPISection;
