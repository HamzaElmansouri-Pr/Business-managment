import { useState } from "react";
import { api } from "@/lib/api";

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    type: "product",
    price: "",
    stock: "",
    is_active: true,
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
    if (!formData.sku) newErrors.sku = "SKU is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a valid positive number.";
    }
    
    if (formData.type === "product") {
      if (!formData.stock) newErrors.stock = "Stock is required for products.";
      if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0 || !Number.isInteger(Number(formData.stock))) {
        newErrors.stock = "Stock must be a valid positive integer.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: formData.type === "product" ? Number(formData.stock) : undefined,
      };
      
      await api.post("/products", payload);
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          backendErrors[key] = (msgs as string[])[0];
        }
        setErrors(backendErrors);
      } else {
        setGlobalError(err instanceof Error ? err.message : "Failed to create product");
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="sku">
            SKU <span className="text-[var(--danger-fg)]">*</span>
          </label>
          <input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.sku ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus:border-[var(--accent)] transition-colors`}
          />
          {errors.sku && <p className="text-xs text-[var(--danger-fg)] mt-1">{errors.sku}</p>}
        </div>
        
        <div className="flex-1">
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="type">
            Type <span className="text-[var(--danger-fg)]">*</span>
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)] transition-colors appearance-none`}
          >
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="price">
            Price <span className="text-[var(--danger-fg)]">*</span>
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.price ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus:border-[var(--accent)] transition-colors`}
          />
          {errors.price && <p className="text-xs text-[var(--danger-fg)] mt-1">{errors.price}</p>}
        </div>

        {formData.type === "product" && (
          <div className="flex-1">
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="stock">
              Stock <span className="text-[var(--danger-fg)]">*</span>
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className={`w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border ${errors.stock ? 'border-[var(--danger-fg)]' : 'border-[var(--border)]'} text-sm outline-none focus:border-[var(--accent)] transition-colors`}
            />
            {errors.stock && <p className="text-xs text-[var(--danger-fg)] mt-1">{errors.stock}</p>}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-4 h-4 rounded-[4px] border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0 bg-[var(--surface-2)] accent-[var(--accent)]"
        />
        <label htmlFor="is_active" className="text-sm text-[var(--text-secondary)] cursor-pointer select-none">
          Active product
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
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
          {loading ? "Saving…" : "Save product"}
        </button>
      </div>
    </form>
  );
}
