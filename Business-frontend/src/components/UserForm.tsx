import { useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";

interface UserFormProps {
  user?: User;
  onSuccess: (tempPassword?: string) => void;
  onCancel: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "staff",
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
      if (user) {
        await api.patch(`/users/${user.id}`, formData);
        onSuccess();
      } else {
        const res = await api.post<{ meta?: { temporary_password?: string } }>("/users", formData);
        onSuccess(res.meta?.temporary_password);
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          backendErrors[key] = (msgs as string[])[0];
        }
        setErrors(backendErrors);
      } else {
        setGlobalError(err.response?.data?.message || err.message || "Failed to save user");
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
          className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.name ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-colors`}
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
          className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.email ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-colors`}
        />
        {errors.email && <p className="text-xs text-[var(--danger-fg)] mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="role">
          Role <span className="text-[var(--danger-fg)]">*</span>
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] text-sm outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-colors appearance-none`}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
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
          {loading ? "Saving…" : (user ? "Save user" : "Create user")}
        </button>
      </div>
    </form>
  );
}
