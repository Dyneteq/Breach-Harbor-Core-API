# Breach Harbor (Core API)

## Setup

In server:

```bash
source .venv/bin/activate
python manage.py runserver

```

In client:

```bash
npm run start
```

To create and apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Challenges

- Maxmind's lite db must be downloaded manually and they require an account for this

## Roadmap

- Setup PostgreSQL
- Setup Docker
- Increase Test coverage
