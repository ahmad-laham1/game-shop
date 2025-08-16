# Frontend - React + Vite (Game Shop UI)

This is the single-page application for browsing products, logging in, purchasing, and viewing receipts.

---

## 1. Requirements

- Node.js (LTS recommended)
- npm (comes with Node)

---

## 2. Setup & Run

**Step 1 – Install dependencies**  
Installs all JavaScript packages listed in `package.json`.

```bash
npm install
```

**Step 2 – Configure backend API base**
Make sure the API base URL points to your backend.
Edit .env:

VITE_API_BASE_URL= = "http://127.0.0.1:8000";

**Step 3 – Start the dev server**
Runs the frontend locally with hot reload.

```bash
npm run dev
```

## Routes:

Public routes:

- /login – Login form

- /signup – Registration form

Protected routes (require login):

- products – Paginated product list with optional JO/SA filter

- products/:id – Product details and “Buy” button

- receipt/:id – Displays order confirmation

## Authentication

- When a user logs in or signs up, the backend returns { access, refresh } tokens.

- Tokens are stored in localStorage.

- Axios interceptor automatically adds Authorization: Bearer <access> to requests.

- If access token expires, it automatically calls /api/token/refresh/ once to get a new one.

## Pagination

The UI calls /api/products/?page=<num>&page_size=<num> to fetch products.
Default page_size is 12 (set by backend).

## Styling

- Product list uses responsive CSS Grid for mobile/desktop layouts.

- CSS files: src/App.css and src/index.css.
