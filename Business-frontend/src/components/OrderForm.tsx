import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Customer, Product, PaginatedResponse } from "@/lib/types";
import { Search, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";

interface OrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const currency = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function OrderForm({ onSuccess, onCancel }: OrderFormProps) {
  const [step, setStep] = useState(1);
  
  // Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Form State
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [items, setItems] = useState<{ productId: number; quantity: number }[]>([]);
  const [notes, setNotes] = useState("");
  
  // Status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Search
  const [customerSearch, setCustomerSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      try {
        const [custRes, prodRes] = await Promise.all([
          api.get<PaginatedResponse<Customer>>("/customers"),
          api.get<PaginatedResponse<Product>>("/products")
        ]);
        setCustomers(custRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        setGlobalError("Failed to load necessary data for order creation.");
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
      c.email.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customers, customerSearch]);

  const orderTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? Number(product.price) * item.quantity : 0);
    }, 0);
  }, [items, products]);

  const handleNextStep = () => {
    if (!customerId) {
      setErrors({ customer: "Please select a customer to continue." });
      return;
    }
    setErrors({});
    setStep(2);
  };

  const addItem = () => {
    if (products.length > 0) {
      setItems([...items, { productId: products[0].id, quantity: 1 }]);
    }
  };

  const updateItem = (index: number, field: 'productId' | 'quantity', value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    if (items.length === 0) {
      setErrors({ items: "Add at least one item to the order." });
      return;
    }

    const hasInvalidQuantity = items.some(i => i.quantity <= 0);
    if (hasInvalidQuantity) {
      setErrors({ items: "All quantities must be at least 1." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_id: customerId,
        notes: notes,
        items: items.map(i => ({
          product_id: i.productId,
          quantity: i.quantity,
        })),
      };
      
      await api.post("/orders", payload);
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          backendErrors[key] = (msgs as string[])[0];
        }
        setErrors(backendErrors);
      } else {
        setGlobalError(err instanceof Error ? err.message : "Failed to create order");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return <div className="py-8 text-center text-sm text-[var(--text-muted)] animate-pulse">Loading data…</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {globalError && (
        <div className="p-3 rounded-[var(--radius)] border border-[#ffb3b3] bg-[#fff2f2] text-[#c00000] text-sm dark:bg-[#331111] dark:border-[#662222] dark:text-[#ff9999]">
          {globalError}
        </div>
      )}

      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-[var(--accent)]' : 'bg-[var(--surface-2)]'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-[var(--accent)]' : 'bg-[var(--surface-2)]'}`} />
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h3 className="font-medium mb-1">Select Customer</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">Choose the customer placing this order.</p>
            
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-1)] focus-within:border-[var(--accent)] transition-colors">
              <Search size={14} className="text-[var(--text-muted)]" />
              <input
                placeholder="Search customers…"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)] w-full"
              />
            </div>

            <div className="max-h-60 overflow-y-auto border border-[var(--border)] rounded-[var(--radius)] custom-scrollbar">
              {filteredCustomers.length === 0 ? (
                <div className="p-4 text-center text-sm text-[var(--text-muted)]">No customers found</div>
              ) : (
                <div className="flex flex-col divide-y divide-[var(--border)]">
                  {filteredCustomers.map(customer => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => setCustomerId(customer.id)}
                      className={`flex flex-col text-left px-3 py-2.5 transition-colors ${customerId === customer.id ? 'bg-[var(--surface-2)]' : 'hover:bg-[var(--surface-2)]/50'}`}
                    >
                      <span className={`text-sm ${customerId === customer.id ? 'font-medium text-[var(--accent)]' : ''}`}>{customer.name}</span>
                      <span className="text-xs text-[var(--text-secondary)]">{customer.email}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.customer && <p className="text-xs text-[var(--danger-fg)] mt-1.5">{errors.customer}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-[var(--radius)] border border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[var(--radius)] bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 transition-opacity"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-2">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Line Items</h3>
              <button 
                type="button" 
                onClick={addItem}
                className="flex items-center gap-1 text-xs text-[var(--accent)] hover:opacity-80 transition-opacity"
              >
                <Plus size={12} /> Add item
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-[var(--border-strong)] rounded-[var(--radius)] text-sm text-[var(--text-muted)]">
                No items added yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <select
                        value={item.productId}
                        aria-label="Select product"
                        onChange={(e) => updateItem(index, 'productId', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] text-sm outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-colors"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - {currency(Number(p.price))}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        aria-label="Quantity"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] text-sm outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-colors"
                        placeholder="Qty"
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => removeItem(index)}
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--danger-fg)] hover:bg-[var(--surface-2)] rounded-[var(--radius)] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.items && <p className="text-xs text-[var(--danger-fg)] mt-2">{errors.items}</p>}
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
            <span className="text-sm font-medium">Total</span>
            <span className="text-base font-semibold">{currency(orderTotal)}</span>
          </div>

          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="notes">
              Order Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] text-sm outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium rounded-[var(--radius)] bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create order"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
