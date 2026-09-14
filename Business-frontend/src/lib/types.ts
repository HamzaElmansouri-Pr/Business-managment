export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  orders_count?: number;
  created_at: string;
};

export type ProductType = "product" | "service";

export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  type: ProductType;
  price: number;
  stock: number | null;
  is_active: boolean;
};

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type OrderItem = {
  id: number;
  product: Pick<Product, "id" | "name" | "sku">;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: number;
  customer: Pick<Customer, "id" | "name" | "email" | "phone" | "address">;
  status: OrderStatus;
  total: number;
  notes?: string | null;
  items?: OrderItem[];
  created_at: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
};
