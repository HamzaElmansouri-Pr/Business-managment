# Deploying Business Management

This guide explains how to deploy the decoupled Business Management application:
1. **Laravel Backend** to [Railway](https://railway.app/).
2. **Next.js Frontend** to [Vercel](https://vercel.com/).

---

## 1. Deploy the Backend (Railway)

### Provisioning
1. Log into your [Railway Dashboard](https://railway.app/dashboard).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select this repository and the `Business-backend` root directory if deploying as a monorepo, or push the backend as a standalone repo.
4. Add a **MySQL** or **PostgreSQL** database plugin to your Railway project (Railway handles the internal network routing automatically).

### Environment Variables
In your Railway backend service settings, go to the **Variables** tab and set the following:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_GENERATED_APP_KEY_HERE
APP_URL=https://your-railway-app-url.up.railway.app
FRONTEND_URL=https://your-vercel-app-url.vercel.app

DB_CONNECTION=mysql # or pgsql
DB_HOST=${MYSQL_HOST}
DB_PORT=${MYSQL_PORT}
DB_DATABASE=${MYSQL_DATABASE}
DB_USERNAME=${MYSQL_USER}
DB_PASSWORD=${MYSQL_PASSWORD}
```

*Tip: You can generate an `APP_KEY` locally using `php artisan key:generate --show`.*

### Build and Start Commands
Railway usually auto-detects Laravel (via Nixpacks), but ensure these are configured in the service settings under **Build / Start**:
- **Build Command:** `composer install --no-dev --optimize-autoloader`
- **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT` (or configure a standard Nginx/PHP-FPM setup depending on your preference).

### Database Seeding
Once the deployment succeeds and the database is linked:
1. Open the Railway CLI or the **terminal** within the Railway dashboard for your backend service.
2. Run the migrations and seed the production database with realistic data:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```
   *This seeds the test users (`test@example.com`, `manager@opsly.test`, etc.), realistic Customers, Products, and ~40 historical Orders for a robust demo.*

---

## 2. Deploy the Frontend (Vercel)

### Provisioning
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Select your GitHub repository.
4. Set the **Root Directory** to `Business-frontend` (if deploying from a monorepo).
5. Vercel will automatically detect the **Next.js** framework.

### Environment Variables
Before hitting Deploy, open the **Environment Variables** section and add:

```env
NEXT_PUBLIC_API_URL=https://your-railway-app-url.up.railway.app/api/v1
```
*(Ensure this matches the exact public URL provided by Railway).*

### Deploy
1. Click **Deploy**. Vercel will run `npm run build`.
2. Once the build completes, Vercel will assign a production domain (e.g., `https://your-app.vercel.app`).

---

## 3. Post-Deployment Verification

Now that both frontend and backend are live:
1. Go back to your Railway backend **Variables** and ensure `FRONTEND_URL` exactly matches the Vercel domain. This satisfies CORS.
2. Open your live Vercel domain in a browser.
3. Attempt to log in using:
   - **Email:** `test@example.com`
   - **Password:** `password`
4. If successful, you will be redirected to the Dashboard. Create a test order to verify full end-to-end connectivity!
