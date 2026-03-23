# ELUPD Dashboard (Negros Island Region)

This workspace contains a unified Environmental and Land Use Planning and Development (ELUPD) dashboard for the Negros Island Region (including Siquijor).

## Project Overview

- **Backend:** Unified Django + Django REST Framework (Python) providing a robust CRUD API for land use planning and compliance monitoring.
- **Frontend:** Modern React + Vite (TypeScript) dashboard with interactive maps, statistics, and data management.
- **Data Scripts:** Python scripts for fetching and processing municipality boundaries from OpenStreetMap.

## Getting Started

### Backend

The backend is located in the `backend/` directory.

1. Activate your Python virtual environment (e.g., `environment/Scripts/activate`).
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   *The backend will run on http://localhost:8000.*

### Frontend

The frontend is located in the `frontend/` directory.

1. Install dependencies and start the development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will run on http://localhost:5173 and proxy `/api` requests to the Django backend.*

## Key Features

- **Consolidated Architecture:** Single-backend design for data consistency and performance.
- **API-Driven:** Real-time data synchronization between the React frontend and Django backend.
- **Advanced Maps:** Custom boundary processing for the Negros Island Region.
- **Compliance Monitoring:** Dedicated tools for tracking CLUP status and PDPFPD compliance.

## Directory Structure

- `backend/`: Django project and core application.
- `frontend/`: React source code, components, and assets.
- `environment/`: Python virtual environment (if provided).
- `*.py`: Data processing scripts for GIS boundaries.
