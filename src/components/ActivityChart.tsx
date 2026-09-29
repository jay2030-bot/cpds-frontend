import { ActivityPoint } from '../types/dashboard';

const SERIES: { key: keyof Omit<ActivityPoint, 'date'>; color: string; label: string }[] = [
  { key: 'genuine', color: 'bg-emerald-500', label: 'Genuine' },
  { key: 'suspicious', color: 'bg-amber-500', label: 'Suspicious' },
  { key: 'invalid', color: 'bg-red-500', label: 'Invalid' },
  { key: 'deactivated', color: 'bg-slate-400', label: 'Deactivated' },
  { key: 'expired', color: 'bg-purple-400', label: 'Expired' },
];

/**
 * A dependency-free stacked bar chart (plain CSS, no chart library). Keeps the frontend
 * build small and the code easy to read/explain, which matches the spec's "keep the
 * architecture simple enough for a student to understand" guidance (section 1).
 */
export function ActivityChart({ points }: { points: ActivityPoint[] }) {
  const maxTotal = Math.max(1, ...points.map((p) => p.genuine + p.suspicious + p.invalid + p.deactivated + p.expired));

  return (
    <div>
      <div className="flex h-40 items-end gap-1">
        {points.map((p) => {
          const total = p.genuine + p.suspicious + p.invalid + p.deactivated + p.expired;
          return (
            <div key={p.date} className="group relative flex flex-1 flex-col justify-end" title={`${p.date}: ${total} scans`}>
              <div className="flex w-full flex-col-reverse overflow-hidden rounded-sm" style={{ height: `${(total / maxTotal) * 100}%`, minHeight: total > 0 ? 2 : 0 }}>
                {SERIES.map(({ key, color }) =>
                  p[key] > 0 ? <div key={key} className={color} style={{ height: `${(p[key] / total) * 100}%` }} /> : null,
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
        {SERIES.map(({ key, color, label }) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${color}`} /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}
