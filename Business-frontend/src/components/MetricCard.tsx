export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--surface-1)] rounded-[var(--radius)] p-4">
      <p className="text-sm text-[var(--text-secondary)] mb-1.5">{label}</p>
      <p className="text-[22px] font-medium">{value}</p>
    </div>
  );
}
