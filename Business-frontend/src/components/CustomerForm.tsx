import { useState } from "react";
import { api } from "@/lib/api";

interface CustomerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CustomerForm({ onSuccess, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post("/customers", formData);
      onSuccess();
    } catch (err: any) {
      // Handle potential validation errors from backend
      if (err.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          backendErrors[key] = (msgs as string[])[0];
        }
        setErrors(backendErrors);
      } else {
        setGlobalError(err instanceof Error ? err.message : "Failed to create customer");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {globalError && (
        <div className="p-3 rounded-[var(--radius)] border border-[#ffb3b3] bg-[#fff2f2] text-[#c00000] text-sm dark:bg-[#331111] dark:border-[#662222] dark:text-[#ff9999]">
          {globalError}
        </div>
      )}

      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="name">
          Name <span className="text-[var(--danger-fg)]">*</span>
        </label>
        <input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.name ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus:border-[var(--accent)] transition-colors`}
        />
        {errors.name && <p className="text-xs text-[var(--danger-fg)] mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="email">
          Email <span className="text-[var(--danger-fg)]">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.email ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus:border-[var(--accent)] transition-colors`}
        />
        {errors.email && <p className="text-xs text-[var(--danger-fg)] mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.phone ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus:border-[var(--accent)] transition-colors`}
        />
        {errors.phone && <p className="text-xs text-[var(--danger-fg)] mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="address">
          Address
        </label>
        <textarea
          id="address"
          rows={3}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.address ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus:border-[var(--accent)] transition-colors resize-none`}
        />
        {errors.address && <p className="text-xs text-[var(--danger-fg)] mt-1">{errors.address}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-[var(--radius)] border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-[var(--radius)] bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save customer"}
        </button>
      </div>
    </form>
  );
}
