"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Customer, PaginatedResponse } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { CustomerForm } from "@/components/CustomerForm";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      try {
        const query = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : "";
        const res = await api.get<PaginatedResponse<Customer>>(`/customers${query}`);
        setCustomers(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load customers");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, [debouncedSearch, refreshTrigger]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-medium">Customers</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-[var(--radius)] border border-[var(--border-strong)] hover:bg-[var(--surface-1)] transition-colors"
        >
          <Plus size={14} />
          New customer
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] max-w-xs focus-within:border-[var(--accent)] transition-colors">
        <Search size={14} className="text-[var(--text-muted)]" />
        <input
          placeholder="Search customers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)] w-full"
        />
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
              <th className="text-left font-normal px-4 py-2.5">Email</th>
              <th className="text-left font-normal px-4 py-2.5">Location</th>
              <th className="text-right font-normal px-4 py-2.5">Orders</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-32 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-40 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-24 animate-pulse" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-[var(--surface-2)] rounded w-6 ml-auto animate-pulse" /></td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-muted)]">
                  No customers yet
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-2.5">{customer.name}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{customer.email}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{customer.address || "—"}</td>
                  <td className="px-4 py-2.5 text-right">{customer.orders_count || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="New Customer"
      >
        <CustomerForm 
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
