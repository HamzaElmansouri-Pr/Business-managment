# Business Managment

[![Backend Tests](https://github.com/HamzaElmansouri-Pr/Business-managment/actions/workflows/tests.yml/badge.svg)](https://github.com/HamzaElmansouri-Pr/Business-managment/actions/workflows/tests.yml)
[![Frontend Build](https://github.com/HamzaElmansouri-Pr/Business-managment/actions/workflows/build.yml/badge.svg)](https://github.com/HamzaElmansouri-Pr/Business-managment/actions/workflows/build.yml)

A premium, decoupled Business Management Platform providing seamless CRM, inventory, and order processing capabilities. 
**Live Demo:** [https://opsly-demo.vercel.app](https://opsly-demo.vercel.app) *(Replace with your live Vercel URL)*

### Demo Logins
- `test@example.com` / `password` — full access (Admin)
- `manager@opsly.test` / `password` — no delete access (Manager)
- `staff@opsly.test` / `password` — read-only on customers/products (Staff)

## Core Features
- **Role-based access control (Admin / Manager / Staff)** — permissions are enforced in the API and reflected in the UI (see the role badge and restricted actions when logged in as Staff).
- **In-App & Email Notifications** — real-time database and mail notifications triggered by order status updates, featuring an interactive notification bell in the dashboard.
- **Full REST API with form validation and structured error responses** — every write endpoint validates input server-side and returns field-level errors, not just a generic failure.
- **Search and filtering on every list view** — customers by name/email, products by name/sku/type, orders by status.
- **17 feature tests covering auth, CRUD, and authorization boundaries** — all passing and ensuring robust quality assurance.
- **Responsive admin UI**, REST API, and the core CRUD modules (customers, products/services, orders).

## API Documentation
The API documentation is provided as a complete Postman collection, which serves as the single source of truth for all available endpoints.

1. Download the [`postman/opsly-api.postman_collection.json`](postman/opsly-api.postman_collection.json) file from this repository.
2. Import the collection into Postman.
3. **Variables**: The collection uses two main variables:
   - `base_url`: Defaults to `http://localhost:8000/api`. If testing against the production API, override this variable to your live Railway app URL (e.g., `https://opsly-backend-production.up.railway.app/api`).
   - `token`: Run the `Auth > Login` endpoint using one of the demo credentials to retrieve an access token. Paste the `token` value from the response into your Postman collection's `token` variable. All subsequent requests will authenticate automatically using Bearer Auth!

## Tech Stack
- **Backend:** Laravel 11 + Sanctum + Spatie Permission
- **Frontend:** Next.js + TypeScript + Tailwind (Custom Glassmorphism CSS)

## Screenshots
### Dashboard
![Dashboard](Business-frontend/public/screenshots/dashboard.png)

### Order Details
![Order Details](Business-frontend/public/screenshots/order-detail.png)

---

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- PHP (v8.2+)
- Composer

### 1. Clone the repository
```bash
git clone https://github.com/HamzaElmansouri-Pr/Business-managment.git
cd "Business-managment"
```

### 2. Backend Setup (Laravel)
```bash
cd Business-backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```
*The backend will be running on `http://localhost:8000`. The seeder automatically provisions the demo accounts listed above.*

### 3. Frontend Setup (Next.js)
```bash
cd ../Business-frontend
cp .env.example .env
npm install
npm run dev
```
*The frontend will be running on `http://localhost:3000`. Open it in your browser and log in.*

For deployment instructions, please refer to [DEPLOY.md](DEPLOY.md).
