"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Product, PaginatedResponse } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { ProductForm } from "@/components/ProductForm";

const currency = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PaginatedResponse<Product>>("/products");
        setProducts(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [refreshTrigger]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-medium">Products & services</h1>
        <button 
          aria-label="New product"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-[var(--radius)] border border-[var(--border-strong)] hover:bg-[var(--surface-1)] transition-colors"
        >
          <Plus size={14} />
          New product
        </button>
      </div>


      {error && (
        <div className="mb-6 p-3 rounded-[var(--radius)] border border-[#ffb3b3] bg-[#fff2f2] text-[#c00000] text-sm dark:bg-[#331111] dark:border-[#662222] dark:text-[#ff9999]">
          {error}
        </div>
      )}

      <div className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm min-w-[600px] whitespace-nowrap">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-secondary)]">
              <th className="text-left font-normal px-4 py-2.5">Name</th>
              <th className="text-left font-normal px-4 py-2.5">SKU</th>
              <th className="text-left font-normal px-4 py-2.5">Type</th>
              <th className="text-left font-normal px-4 py-2.5">Stock</th>
              <th className="text-right font-normal px-4 py-2.5">Price</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-32 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-20 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-16 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-12 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-16 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                  No products yet
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-2.5">
                    {product.name}
                    {!product.is_active && (
                      <span className="ml-2 text-xs text-[var(--text-muted)]">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{product.sku}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)] capitalize">{product.type}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{product.stock ?? "—"}</td>
                  <td className="px-4 py-2.5 text-right">{currency(Number(product.price))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="New Product"
      >
        <ProductForm 
          onCancel={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      </Modal>
    </div>
  );
}
