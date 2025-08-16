# Game Shop – Full Stack Application (Django + React)

This repository contains both the backend API (Django + DRF) and the frontend SPA (React + Vite) for the Game Shop assignment.

---

## Project Structure

├─ backend/ # Django REST API
├─ frontend/ # React + Vite frontend
└─ sample-data/ # CSVs for importing products (optional)

---

## Requirements

- **Backend:** Python 3.11+, pip
- **Frontend:** Node.js (LTS), npm

---

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv             # Create virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt # Install backend dependencies
python manage.py migrate        # Apply database migrations
python manage.py import_products {file-name}.csv  # Load initial data
python manage.py runserver      # Start backend server
```

### 2. Frontend

```bash
cd frontend
npm install # Install frontend dependencies

# Edit src/api/client.js if needed to set API_BASE to your backend URL

npm run dev # Start Vite dev server
```

## 3. Authentication

- Most API endpoints require authentication using JWT tokens.
- Signup: POST /api/signup/ → returns { user, access, refresh }

- Login: POST /api/token/ → returns { access, refresh }

- Refresh: POST /api/token/refresh/ → returns new access token
- Use the Authorization: Bearer <access> header when calling protected endpoints.

## API Documentation

- Swagger UI: http://127.0.0.1:8000/api/docs/

- OpenAPI schema: http://127.0.0.1:8000/api/schema/

## API Documentation

**Base URL:** `<BASE_URL>`

- Swagger UI: `<BASE_URL>/api/docs/`
- OpenAPI (JSON): `<BASE_URL>/api/schema/?format=openapi-json`
- OpenAPI (YAML): `<BASE_URL>/api/schema/?format=yaml`

**Examples**

- Local dev: `http://127.0.0.1:8000`
- (Optional) Staging: `https://staging.example.com`
- (Optional) Prod: `https://api.example.com`
