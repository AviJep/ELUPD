# Backend

This directory contains two backends:

1. A legacy **Express + SQLite** implementation (TypeScript).
2. A new **Django + Django REST Framework** implementation (Python).

---

## Django backend (recommended)

### Setup

1. Create/activate the virtual environment (already provided in `.venv`):
   - Windows: `\.venv\Scripts\activate`
   - macOS/Linux: `source .venv/bin/activate`

2. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:3001
```

The Django backend will expose the same endpoints under `/api/` (e.g. `/api/health`, `/api/provinces`, `/api/reset-db`).

---

## Express backend (legacy)

This is the original API implementation in TypeScript.

### Available scripts

- `npm run dev` - start the server with ts-node and nodemon for development
- `npm run build` - compile TypeScript into the `dist` directory
- `npm run start` - run the compiled server

The server listens on `PORT` environment variable or `3001` by default and
exposes a health endpoint at `/api/health`.
