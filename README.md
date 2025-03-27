<div align="center">
  <h1>BREACH::HARBOR</h1>
  <p><strong>Proactive Cybersecurity Defense Platform</strong></p>
  
  <p>
    <a href="https://github.com/Dyneteq/Breach-Harbor-Core-API/issues">Report Bug</a>
    ·
    <a href="https://github.com/Dyneteq/Breach-Harbor-Core-API/issues">Request Feature</a>
    ·
    <a href="https://breachharbor.com">Official Website</a>
  </p>
</div>

## Overview

BREACH::HARBOR is a state-of-the-art cybersecurity suite designed to safeguard digital assets against both existing and emergent cyber threats. By leveraging a combination of local data collection and global threat intelligence, this platform offers an unparalleled, proactive defense mechanism.

> "Don't just defend, anticipate. Experience the power of proactive protection."

<p align="center">
  <img src="doc/bh-dash-1.png" alt="Breach Harbor Dashboard" width="800"/>
</p>

## Key Features

- **Real-time Threat Detection** - Identify and analyze potential threats as they emerge
- **Distributed Collection** - Deploy collectors across multiple network environments
- **Cloud Intelligence** - Leverage global threat data to enhance local security
- **Comprehensive Visualization** - Intuitive dashboard for threat monitoring and analysis
- **Automated Response** - Configure customized security policies and responses

## Architecture

BREACH::HARBOR is elegantly streamlined into three primary components:

<div align="center">
  <table>
    <tr>
      <td align="center"><h3>🔍 COLLECTOR</h3></td>
      <td align="center"><h3>🧠 CORE API</h3></td>
      <td align="center"><h3>🛡️ DEFENDER</h3></td>
    </tr>
    <tr>
      <td>On the front lines, diligently gathering threat data from your environment</td>
      <td>Central hub where data is processed, analyzed, and visualized</td>
      <td>Enforces robust security policies based on intelligence from the Core API</td>
    </tr>
  </table>
</div>

**This repository contains the Core API**, including both the backend (Python/Django) and the frontend (ReactJS).

## Project Status

⚠️ **IMPORTANT**: This project is in its early stages and is not yet recommended for production use. It's under active development, so expect changes in the API or other major functionalities.

## Getting Started

For now, only development/local setup is supported:

### Prerequisites

- Python 3.8+
- Node.js 14+
- MaxMind GeoLite2 database (requires free account)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Dyneteq/Breach-Harbor-Core-API.git
cd Breach-Harbor-Core-API/breach_harbor_core

# Set up virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run development server
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run start
```

## Roadmap

### Upcoming Features

- **Enhanced Notifications** - View, delete, mark as read
- **Advanced Search** - IP Address DB, Incidents, Collectors
- **Incident Grouping** - Organize and categorize security events
- **IP Intelligence** - Identify anonymous proxies, TOR nodes, etc.
- **User Activity Logging** - Track and audit system usage

### System Improvements

- PostgreSQL integration
- Docker containerization
- Increased test coverage

## Contributing

We welcome contributions to BREACH::HARBOR! A comprehensive guide will be added soon with guidelines on how to proceed. Join us in building the next generation of cybersecurity defense!

## License

BREACH::HARBOR is released under the [GPL-3.0 license](https://github.com/Dyneteq/Breach-Harbor-Core-API/blob/master/LICENCE).

---

<div align="center">
  <a href="https://breachharbor.com">
    <img src="https://img.shields.io/badge/BREACH::HARBOR-Website-blue" alt="Website"/>
  </a>
  <a href="https://github.com/Dyneteq/Breach-Harbor-Core-API/issues">
    <img src="https://img.shields.io/github/issues/Dyneteq/Breach-Harbor-Core-API" alt="Issues"/>
  </a>
  <a href="https://github.com/Dyneteq/Breach-Harbor-Core-API/blob/master/LICENCE">
    <img src="https://img.shields.io/badge/License-GPL%20v3-green.svg" alt="License"/>
  </a>
</div>