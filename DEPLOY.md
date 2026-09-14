# Deployment Guide

Business management is composed of a Next.js (React) frontend and a Laravel (PHP) backend. Follow these instructions to deploy them to Vercel and Railway, respectively.

## 1. Backend (Laravel) → Railway

Railway provides a seamless way to deploy PHP applications with database provisioning.

### Setup
1. Connect your repository to Railway and create a new project.
2. Add a **MySQL** or **PostgreSQL** database plugin to your Railway project.
3. Railway will automatically detect Laravel via `composer.json` and build the app using Nixpacks.

### Environment Variables
Set the following environment variables in your Railway project settings:
```ini
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your_generated_app_key_here # Run php artisan key:generate locally to get one
APP_URL=https://your-railway-app.up.railway.app

# Database URL provided by Railway
DB_CONNECTION=mysql # or pgsql
DB_HOST=...
DB_PORT=...
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

# Sanctum specific
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
SESSION_DOMAIN=.your-vercel-app.vercel.app
```

### First Deploy (Migrations & Seeding)
To run migrations and seed the database on your first deploy, you have two options:
1. **Custom Build Command (Recommended):** In Railway's settings for the service, set the Start Command to:
   `php artisan migrate --force --seed && php artisan serve --host=0.0.0.0 --port=$PORT`
2. **Railway CLI:** Install the Railway CLI locally, link the project, and run:
   `railway run php artisan migrate --force --seed`

---

## 2. Frontend (Next.js) → Vercel

Vercel is the optimal hosting platform for Next.js applications, offering zero-configuration deployments.

### Setup
1. Log into Vercel and create a **New Project**.
2. Import your repository. Vercel will automatically detect the Next.js framework.
3. If your frontend code is in a subdirectory (e.g., `Business-frontend`), specify that as the **Root Directory** in the Vercel project settings.

### Environment Variables
You only need to configure one primary environment variable for the frontend to communicate with the deployed Laravel backend:

```ini
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app/api
```

### Deployment
Click **Deploy**. Vercel will run `npm run build` and provision the edge network. Once complete, your dashboard will be live and ready to connect to the backend.
