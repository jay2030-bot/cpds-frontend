const COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  INACTIVE: 'bg-slate-200 text-slate-700',
  RECALLED: 'bg-red-100 text-red-800',
  DEACTIVATED: 'bg-slate-200 text-slate-700',
  EXPIRED: 'bg-amber-100 text-amber-800',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${COLORS[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}
