# Backend - Django + DRF (Game Shop API)

This is the REST API for the Game Shop assignment. It provides:

- **Product listing** (with pagination and location filter)
- **Product details**
- **Order creation** (purchase flow)
- **JWT-based authentication**
- **Interactive API documentation**

---

## 1. Why these choices

- **SQLite**: Chosen for local development because it requires zero configuration and works out-of-the-box.  
  _(For production, the same models can be migrated to PostgreSQL or MySQL without code changes.)_

- **JWT (SimpleJWT)**: Keeps the backend stateless, making it easier to scale and avoiding server-side session storage.

- **Pagination (12 default)**: Improves performance and ensures the frontend doesn’t fetch huge product lists at once.

- **`price_at_purchase` field**: Stored on `Order` to keep a record of the price when the order was placed, even if the product price changes later.

---

## 2. Requirements

- Python 3.11+ (tested on 3.13)
- pip (Python package manager)

---

## 3. Setup & Run

**Step 1 – Create and activate virtual environment**  
Keeps dependencies isolated from your system Python.

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

**Step 2 – Install dependencies**
Installs all backend packages listed in requirements.txt.

```bash
pip install -r requirements.txt
```

**Step3 - Apply migrations**
Creates database tables based on Django models.

```bash
python manage.py migrate
```

**Step 5 – Import products from CSV**
Loads initial product data into the database.

```bash
python manage.py import_products {file name}.csv
```

**Step 6 – Run server**

```bash
python manage.py runserver
```

## 4 - CSV Format

title,description,price,location
Examples:
Rainbow Six Siege,Open-world action RPG,39.99,JO
Baldur's Gate 3,Turn-based RPG,59.99,SA

## 5 - Most API endpoints require the user to be authenticated with a JWT access token.

Signup:
POST /api/signup/ with username & password. Returns {user, access, refresh}.

Login:
POST /api/token/ with username & password. Returns {access, refresh}.

Refresh token:
POST /api/token/refresh/ with refresh token to get a new access token.
