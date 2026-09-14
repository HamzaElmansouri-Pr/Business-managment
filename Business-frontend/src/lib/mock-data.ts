import type { Customer, Order, Product } from "./types";

// Placeholder data shaped like the Laravel API responses, so pages render
// before the backend is wired up. Replace calls to these with `api.get(...)`.

export const mockMetrics = {
  revenue: 48120,
  orders: 312,
  customers: 1048,
  avgOrder: 154,
};

export const mockOrders: Order[] = [
  { id: 1042, customer: { id: 1, name: "Karim B.", email: "karim.b@example.com", phone: "+212 6 12 34 56 78", address: "Casablanca" }, status: "completed", total: 220, created_at: "2026-09-10" },
  { id: 1041, customer: { id: 2, name: "Sofia M.", email: "sofia.m@example.com", phone: "+212 6 22 11 09 87", address: "Rabat" }, status: "processing", total: 95, created_at: "2026-09-11" },
  { id: 1040, customer: { id: 3, name: "Youssef A.", email: "youssef.a@example.com", phone: "+212 6 33 44 55 66", address: "Fes" }, status: "pending", total: 310, created_at: "2026-09-12" },
  { id: 1039, customer: { id: 4, name: "Nadia R.", email: "nadia.r@example.com", phone: "+212 6 44 55 66 77", address: "Marrakech" }, status: "completed", total: 178, created_at: "2026-09-12" },
  { id: 1038, customer: { id: 5, name: "Omar T.", email: "omar.t@example.com", phone: "+212 6 55 66 77 88", address: "Tangier" }, status: "cancelled", total: 64, created_at: "2026-09-13" },
];

export const mockCustomers: Customer[] = [
  { id: 1, name: "Karim B.", email: "karim.b@example.com", phone: "+212 6 12 34 56 78", address: "Casablanca", notes: null, orders_count: 6, created_at: "2026-03-02" },
  { id: 2, name: "Sofia M.", email: "sofia.m@example.com", phone: "+212 6 22 11 09 87", address: "Rabat", notes: null, orders_count: 3, created_at: "2026-04-18" },
  { id: 3, name: "Youssef A.", email: "youssef.a@example.com", phone: "+212 6 33 44 55 66", address: "Fes", notes: null, orders_count: 9, created_at: "2026-01-27" },
  { id: 4, name: "Nadia R.", email: "nadia.r@example.com", phone: "+212 6 44 55 66 77", address: "Marrakech", notes: null, orders_count: 2, created_at: "2026-06-05" },
];

export const mockProducts: Product[] = [
  { id: 1, name: "Website audit", sku: "SKU-1001", description: "Full technical + SEO audit", type: "service", price: 180, stock: null, is_active: true },
  { id: 2, name: "CRM setup", sku: "SKU-1002", description: "Custom CRM onboarding", type: "service", price: 420, stock: null, is_active: true },
  { id: 3, name: "Dashboard license", sku: "SKU-1003", description: "Single-tenant dashboard license", type: "product", price: 99, stock: 42, is_active: true },
  { id: 4, name: "Monthly maintenance", sku: "SKU-1004", description: "Ongoing support retainer", type: "service", price: 250, stock: null, is_active: false },
];
