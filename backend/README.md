# Backend (ELUPD)

This directory contains the unified Django-based backend for the ELUPD Dashboard.

## Django + Django REST Framework Implementation

This backend provides a robust and scalable API for managing provinces, municipalities, barangays, compliance records, and archives.

### Setup

1. Create/activate the virtual environment:
   - Windows: `..\environment\Scripts\activate` (using the root project's venv)
   - macOS/Linux: `source ../environment/bin/activate`

2. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running

The backend defaults to port 8000. You can start it using:

```bash
python manage.py runserver
```

The API endpoints are available under the `/api/` prefix (e.g., `/api/compliance`, `/api/provinces`).

### Database Migrations

If you make changes to the models in `core/models.py`, run:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Features

- **CRUD API**: Fully functional endpoints for all data entities using Django Rest Framework.
- **Model Support**: Comprehensive models for Compliance Monitoring (CLUP / PDPFPD).
- **Reset API**: A secure endpoint to clear the database for testing (`/api/reset-db/`).
- **CORS Support**: Pre-configured with `django-cors-headers`.
