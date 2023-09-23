# Welcome to Breach Harbor (Core API)

## Project Status (PLEASE READ)

This project is in its early stages and is not yet recommended for production use. It's under active development, so expect changes in the API or other major functionalities. Check out our roadmap to see the planned features. Contributions and feedback are warmly welcome.

## What is Breach Harbor ?

BREACH::HARBOR is a state-of-the-art cybersecurity suite aimed at safeguarding digital assets against both existing and emergent cyber threats. 
By leveraging a combination of local data collection and global threat intelligence, this software offers an unparalleled, proactive defense mechanism. 
Designed with a modular architecture, it ensures flexibility, allowing individual components to address specific cybersecurity tasks while still 
maintaining a harmonious, integrated framework.

## How it works

BREACH :: HARBOR is elegantly streamlined into three primary components:

- **Collector**: On the front lines, diligently gathering threat data.
- **Core API**: Acts as the central hub where data is: Processed, Analyzed, Visualized for easy interpretation
- **Defender**: Uses insights from the Core API to enforce robust security policies, ensuring resilience against threats.

This repository contains the **Core API**, both the backend (Python/Django) and the frontend (ReactJS). 

## Preview 

A very draft, in-development preview of the dashboard: 

![Optional Alt Text](doc/bh-dash-1.png)

## Getting started

For now only development/local setup is supported:

### Migrations 

Before starting, make sure you have applied migrations:

```bash
python manage.py migrate
```

If you want to create a new one:

```bash
python manage.py makemigrations
```

### Server 

For the server, in `/breach_harbor_core` run:

```bash
source .venv/bin/activate
python manage.py runserver

```

### Client 

For the client, in `/client`, run:

```bash
npm run start
```

## Challenges

- Maxmind's lite db must be downloaded manually and they require an account for this

## Roadmap

### Features 

- Notifications
  - View
  - Delete
  - Multiple mark to delete
  - Mark as read
- Search 
  - IP Address DB
  - Incidents
  - Collectors
- Group 
  - Incidents
- Add IP Address signs for statuses (anon, tor node etc.)
- Add UserActivity log
- Fix recent searches in IP Address View

### System

- Setup PostgreSQL
- Setup Docker
- Increase Test coverage

## Contributing 

We encourage you to contribute to BREACH :: HARBOR! A guide will be added soon for guidelines about how to proceed. Join us!

## LICENCE

BREACH :: HARBOR is released under the [GPL-3.0 license](https://github.com/Dyneteq/Breach-Harbor-Core-API/blob/master/LICENCE)
