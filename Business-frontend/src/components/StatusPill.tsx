import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, { bg: string; fg: string; label: string }> = {
  completed: { bg: "var(--success-bg)", fg: "var(--success-fg)", label: "Completed" },
  processing: { bg: "var(--warning-bg)", fg: "var(--warning-fg)", label: "Processing" },
  pending: { bg: "transparent", fg: "var(--text-secondary)", label: "Pending" },
  cancelled: { bg: "var(--danger-bg)", fg: "var(--danger-fg)", label: "Cancelled" },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const style = STYLES[status];
  return (
    <span
      className="text-sm px-2 py-0.5 rounded-[var(--radius)]"
      style={{ background: style.bg, color: style.fg }}
    >
      {style.label}
    </span>
  );
}
