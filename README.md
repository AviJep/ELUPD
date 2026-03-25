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
- **Advanced Maps:** Interactive maps for Negros Island Region, color-coded by CLUP/PDPFP status.
- **CLUP Monitoring:** Real-time Comprehensive Land Use Plans tracking (prephase to review & approval).
- **PDPFP Compliance:** Provincial Development and Physical Framework status monitoring with Excel-backed data.
- **Compliance Tracking:** Excel-based integration for compliance verification across municipalities.
- **Archive Management:** Soft-archive LGU records with persistent restore/delete capabilities via localStorage.
- **Statistical Reports:** Dashboard analytics with region-wide statistics and progress tracking.
- **Activity Logging:** Comprehensive system logs tracking user actions and data changes.
- **CSV Export:** Export monitoring data to CSV for external reporting and analysis.

## Directory Structure

- `backend/`: Django project and core application.
- `frontend/`: React source code, components, and assets.
- `environment/`: Python virtual environment (if provided).
- `backend/scripts/`: Data processing scripts for GIS boundaries and utilities.

## Dashboard Pages

### Core Monitoring
- **Dashboard:** Central hub with CLUP/PDPFP overview, maps, city municipality table, and quick actions.
- **CLUP Monitoring:** Detailed Comprehensive Land Use Plan status tracking by municipality.
- **PDPFP Monitoring:** Provincial Development and Physical Framework compliance by province.
- **Compliance Monitoring:** Excel-backed compliance verification tied to live annex data.

### Analytics & Reporting
- **Statistics:** System-wide analytics including coverage, completion rates, and trend analysis.
- **Map Intelligence:** Interactive geospatial visualizations for Negros Island Region.
- **Analytics Dashboard:** Historical trends and KPI tracking.

### Management
- **Archive Center:** View, restore, or permanently delete archived LGU records (localStorage-backed).
- **System Logs:** Audit trail of all user actions and system events with filtering.
- **About:** Platform information, tech stack, and regional coverage statistics.

## Data Architecture

### Real-Time Data Sources
- **CLUP Status:** Fetched from `/api/annex-clup-status` endpoint (Excel-backed).
- **PDPFP Status:** Fetched from `/api/annex-pdpfp-status` endpoint (Excel-backed).
- **Compliance Records:** Stored in Django database with Excel annexes for verification.

### State Management
- **LGUContext:** Central context managing active LGUs, archived records, and audit logs.
- **DataContext:** Seed logs and system event tracking.
- **localStorage:** Persistent archive storage with key `elupd_archived_lgus`.

## Archive System

The archive feature allows safe data management without permanent deletion:

1. **Archive Action:** Select "Archive" on any monitoring table to soft-delete a record.
   - Record moves to Archive Center (persistent via localStorage).
   - System log entry created with timestamp.
   - Original data preserved.

2. **Archive Center:** dedicated page (`/archives`) to manage archived records.
   - Search by city/municipality name.
   - Filter by province.
   - Sort by archive date or name.
   - **Restore:** Move record back to active status.
   - **Permanently Delete:** Irreversible removal (logged).

3. **Persistence:** Archives survive across browser refreshes via localStorage.
   - Data stored under `elupd_archived_lgus` key.
   - Auto-synced on archive/restore/delete actions.
   - Suitable for single-user workflows; backend endpoint integration available (future).

## Development Notes

### Environment Variables
Create `.env` in the `frontend/` directory:
```bash
VITE_DJANGO_API_BASE_URL=http://127.0.0.1:8000
```

### Build & Performance
- **Frontend Build:** `npm run build` (Vite) generates optimized production bundle.
- **Chunk Size:** Warnings may appear for packages >500KB (e.g., Recharts, Leaflet); acceptable for this use case.
- **TypeScript:** Full type safety across components, contexts, and utilities.

### Testing the Archive Flow
1. Navigate to Dashboard and select any LGU.
2. Click "Archive" (requires confirmation).
3. Verify record appears in Archive Center (`/archives`).
4. Refresh browser—record persists.
5. Click "Restore" to reactivate or "Delete" for permanent removal.
