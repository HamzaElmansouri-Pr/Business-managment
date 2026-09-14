# Opsly frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 admin dashboard for the
Business Operations Management Platform. Design matches the approved dark
Linear/Vercel-inspired mockup: flat surfaces, hairline borders, one accent
color, quiet tinted status pills.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

- `src/app/(dashboard)/` — sidebar-wrapped pages: overview, customers,
  products, orders (route group, no URL segment)
- `src/app/login/` — standalone login page (no sidebar)
- `src/components/` — Sidebar, MetricCard, StatusPill
- `src/lib/types.ts` — TypeScript types matching the Laravel API resources
  exactly (Customer, Product, Order, OrderItem)
- `src/lib/api.ts` — fetch wrapper that attaches the Sanctum bearer token
  from `localStorage`
- `src/lib/mock-data.ts` — placeholder data (same shape as the API) so every
  page renders before the backend is wired up

## Wiring to the Laravel backend

1. Copy `.env.local.example` to `.env.local` and point
   `NEXT_PUBLIC_API_URL` at your running Laravel API
   (e.g. `http://localhost:8000/api/v1`)
2. Add a `POST /api/v1/auth/login` route on the backend (Sanctum) that
   returns `{ token }` — the login page already calls this
3. Replace the `mockOrders` / `mockCustomers` / `mockProducts` imports in
   each page with `api.get<PaginatedResponse<T>>("/orders")` etc. — the
   response shape already matches (`{ data, meta }`)

## What's next

- Wire real API calls (replace mock-data imports)
- Add create/edit forms (customer, product, order) — modal or dedicated
  route, your call
- Add an authenticated layout guard (redirect to `/login` if no token)
- Order detail page with line items
