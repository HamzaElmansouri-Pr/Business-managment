"use client";

import { Plus } from "lucide-react";
import { StatusPill } from "@/components/StatusPill";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Order, PaginatedResponse } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { OrderForm } from "@/components/OrderForm";

const currency = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<PaginatedResponse<Order>>("/orders");
        setOrders(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [refreshTrigger]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-medium">Orders</h1>
        <button 
          aria-label="New order"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-[var(--radius)] border border-[var(--border-strong)] hover:bg-[var(--surface-1)] transition-colors"
        >
          <Plus size={14} />
          New order
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
              <th className="text-left font-normal px-4 py-2.5">Order</th>
              <th className="text-left font-normal px-4 py-2.5">Customer</th>
              <th className="text-left font-normal px-4 py-2.5">Date</th>
              <th className="text-left font-normal px-4 py-2.5">Status</th>
              <th className="text-right font-normal px-4 py-2.5">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-8 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-24 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-20 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-5 bg-[var(--surface-2)] rounded w-16 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-12 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-muted)]">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr 
                  key={order.id} 
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2.5 font-medium text-[var(--accent)]">#{order.id}</td>
                  <td className="px-4 py-2.5">{order.customer.name}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right">{currency(Number(order.total))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="New Order"
      >
        <OrderForm 
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
