# GeoInspection Pro

GeoInspection Pro is a full-stack geospatial inspection management app.

It provides:
- role-based authentication
- inspection creation and editing with map-based location picking
- category and service-area management
- parcel visualization and parcel-to-inspection spatial linking
- nearby inspection search using PostGIS spatial queries

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Alembic
- Database: PostgreSQL + PostGIS
- Frontend: React + TypeScript + Vite + React Leaflet
- Reverse proxy / static hosting: Nginx
- Orchestration: Docker Compose

## Main Features

- Auth (`/api/auth`)
- Categories (`/api/categories`)
- Inspections (`/api/inspections`)
- Service Areas (`/api/service-areas`)
- Parcels (`/api/parcels`)
- DB health check (`/health/db`)

## Project Structure

- `backend/` FastAPI app, models, routes, Alembic migrations
- `frontend/` React app
- `nginx/` Nginx config and Docker image for serving frontend + proxying API
- `docker-compose.yml` local stack definition

## Quick Start (Docker)

1. Create/update root `.env` (used by `docker-compose.yml`):

```env
POSTGRES_DB=geoinspection
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

2. Build and start:

```bash
docker compose up -d --build
```

3. Apply migrations:

```bash
docker compose exec backend alembic upgrade head
```

4. Open app:
- `http://localhost`
- `https://localhost` (self-signed cert)

## Local Dev (Without Full Docker Frontend Flow)

Backend (venv):
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm ci
npm run dev
```

## Rebuild After Changes

Because images copy source at build time, code changes require rebuilds:

- Backend changes:
```bash
docker compose up -d --build backend
```

- Frontend changes (served via nginx image build):
```bash
docker compose up -d --build nginx
```

- Both:
```bash
docker compose up -d --build backend nginx
```
