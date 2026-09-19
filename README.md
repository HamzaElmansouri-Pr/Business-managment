# Business Managment

[![Backend Tests](https://github.com/HamzaElmansouri-Pr/Business-managment/actions/workflows/tests.yml/badge.svg)](https://github.com/HamzaElmansouri-Pr/Business-managment/actions/workflows/tests.yml)
[![Frontend Build](https://github.com/HamzaElmansouri-Pr/Business-managment/actions/workflows/build.yml/badge.svg)](https://github.com/HamzaElmansouri-Pr/Business-managment/actions/workflows/build.yml)

A premium, decoupled Business Management Platform providing seamless CRM, inventory, and order processing capabilities. 
**Live Demo:**

### Demo Logins
- `test@example.com` / `password` — full access (Admin)


## Core Features
- **Role-based access control (Admin / Manager / Staff)** — permissions are enforced in the API and reflected in the UI (see the role badge and restricted actions when logged in as Staff).
- **In-App & Email Notifications** — real-time database and mail notifications triggered by order status updates, featuring an interactive notification bell in the dashboard.
- **Full REST API with form validation and structured error responses** — every write endpoint validates input server-side and returns field-level errors, not just a generic failure.
- **Search and filtering on every list view** — customers by name/email, products by name/sku/type, orders by status.
- **17 feature tests covering auth, CRUD, and authorization boundaries** — all passing and ensuring robust quality assurance.
- **Responsive admin UI**, REST API, and the core CRUD modules (customers, products/services, orders).

## API Documentation
The API documentation is provided as a complete Postman collection, which serves as the single source of truth for all available endpoints.


## Tech Stack
- **Backend:** Laravel 11 + Sanctum + Spatie Permission
- **Frontend:** Next.js + TypeScript + Tailwind (Custom Glassmorphism CSS)

## Screenshots

### Login Page 
![Login](Business-frontend/public/screenshots/loginpage.png)

### Dashboard
![Dashboard](Business-frontend/public/screenshots/dashboard.png)

### Orders
![Orders](Business-frontend/public/screenshots/orders.png)

### Products
![Products](Business-frontend/public/screenshots/products.png)

### Customers
![Customers](Business-frontend/public/screenshots/customers.png)

### Order Details
![Order Details](Business-frontend/public/screenshots/order-detail.png)

### Settings
![Settings](Business-frontend/public/screenshots/settings.png)

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
