"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import { StatusPill } from "@/components/StatusPill";
import { useAuth } from "@/lib/AuthContext";
import { Trash2, ArrowLeft } from "lucide-react";

const currency = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.get<{ data: Order }>(`/orders/${params.id}`);
      setOrder(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      await api.patch(`/orders/${order.id}`, { status: newStatus });
      await fetchOrder();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!order || !confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/orders/${order.id}`);
      router.push("/orders");
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Failed to delete order");
    }
  };

  if (loading) {
    return <div className="py-8 text-center text-sm text-[var(--text-muted)] animate-pulse">Loading order…</div>;
  }

  if (error || !order) {
    return (
      <div>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6">
          <ArrowLeft size={16} /> Back to orders
        </button>
        <div className="p-4 rounded-[var(--radius)] border border-[#ffb3b3] bg-[#fff2f2] text-[#c00000] text-sm dark:bg-[#331111] dark:border-[#662222] dark:text-[#ff9999]">
          {error || "Order not found"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={16} /> Back to orders
        </button>
        {user?.role === "admin" && (
          <button 
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-[var(--radius)] text-[var(--danger-fg)] hover:bg-[var(--surface-2)] transition-colors border border-[var(--danger-fg)]"
          >
            <Trash2 size={14} /> Delete Order
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl font-medium mb-1">Order #{order.id}</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-secondary)]">Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="px-3 py-1.5 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] text-sm outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-colors appearance-none cursor-pointer disabled:opacity-60"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <StatusPill status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-3 md:col-span-2 bg-[var(--surface-1)] rounded-xl border border-[var(--border)] overflow-x-auto custom-scrollbar">
          <div className="px-5 py-4 border-b border-[var(--border)] min-w-[600px]">
            <h2 className="font-medium text-sm">Line Items</h2>
          </div>
          <table className="w-full text-sm min-w-[600px] whitespace-nowrap">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface-2)]">
                <th className="text-left font-normal px-5 py-2.5">Product</th>
                <th className="text-center font-normal px-5 py-2.5">Qty</th>
                <th className="text-right font-normal px-5 py-2.5">Price</th>
                <th className="text-right font-normal px-5 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-5 py-3">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{item.product.sku}</div>
                  </td>
                  <td className="px-5 py-3 text-center">{item.quantity}</td>
                  <td className="px-5 py-3 text-right">{currency(Number(item.unit_price))}</td>
                  <td className="px-5 py-3 text-right font-medium">{currency(Number(item.unit_price) * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[var(--surface-2)] border-t border-[var(--border)]">
                <td colSpan={3} className="px-5 py-3 text-right font-medium text-[var(--text-secondary)]">Total</td>
                <td className="px-5 py-3 text-right font-semibold text-base">{currency(Number(order.total))}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="col-span-3 md:col-span-1 flex flex-col gap-6">
          <div className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] p-5">
            <h2 className="font-medium text-sm mb-4">Customer Details</h2>
            <div className="text-sm">
              <div className="font-medium mb-1">{order.customer.name}</div>
              <div className="text-[var(--text-secondary)] mb-3">{order.customer.email}</div>
              {order.customer.phone && (
                <div className="text-[var(--text-secondary)] mb-1">
                  <span className="font-medium text-[var(--text-primary)]">Phone:</span> {order.customer.phone}
                </div>
              )}
              {order.customer.address && (
                <div className="text-[var(--text-secondary)]">
                  <span className="font-medium text-[var(--text-primary)]">Address:</span> {order.customer.address}
                </div>
              )}
            </div>
          </div>

          {order.notes && (
            <div className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] p-5">
              <h2 className="font-medium text-sm mb-2">Order Notes</h2>
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
