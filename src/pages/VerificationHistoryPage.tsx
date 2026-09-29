import { useEffect, useState } from 'react';
import { Pagination } from '../components/Pagination';
import { extractErrorMessage } from '../services/api';
import { HistoryFilters, listVerificationHistory } from '../services/verificationHistory.service';
import { PaginationMeta } from '../types/api';
import { RecentLogEntry } from '../types/dashboard';

const RESULT_OPTIONS = ['', 'GENUINE', 'SUSPICIOUS', 'INVALID', 'DEACTIVATED', 'EXPIRED'];
const RISK_OPTIONS = ['', 'LOW', 'MEDIUM', 'HIGH'];

const RESULT_COLORS: Record<string, string> = {
  GENUINE: 'bg-emerald-100 text-emerald-800',
  SUSPICIOUS: 'bg-amber-100 text-amber-800',
  INVALID: 'bg-red-100 text-red-800',
  DEACTIVATED: 'bg-slate-200 text-slate-700',
  EXPIRED: 'bg-amber-100 text-amber-800',
};

/**
 * Serves both /verifications ("Verification History") and /verifications/suspicious
 * ("Suspicious Activity") from the spec's admin/manufacturer page list — same table
 * and filters, just pointed at a different backend endpoint via `suspiciousOnly`.
 */
export function VerificationHistoryPage({ suspiciousOnly = false }: { suspiciousOnly?: boolean }) {
  const [items, setItems] = useState<RecentLogEntry[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setPage(1); }, [result, riskLevel, from, to, suspiciousOnly]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const filters: HistoryFilters = {
      page, limit: 15,
      result: result || undefined,
      riskLevel: riskLevel || undefined,
      from: from || undefined,
      to: to || undefined,
    };
    listVerificationHistory(filters, suspiciousOnly)
      .then((res) => { if (!cancelled) { setItems(res.items); setMeta(res.meta); } })
      .catch((err) => { if (!cancelled) setError(extractErrorMessage(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, result, riskLevel, from, to, suspiciousOnly]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-slate-900">{suspiciousOnly ? 'Suspicious Activity' : 'Verification History'}</h1>

      <div className="flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {!suspiciousOnly && (
          <Select label="Result" value={result} onChange={setResult} options={RESULT_OPTIONS} />
        )}
        <Select label="Risk" value={riskLevel} onChange={setRiskLevel} options={RISK_OPTIONS} />
        <label className="text-xs text-slate-500">
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 block rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </label>
        <label className="text-xs text-slate-500">
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No verification attempts found.</td></tr>
            ) : (
              items.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{log.verificationCode?.product.name ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {log.verificationCode?.verificationToken ?? log.enteredCode ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${RESULT_COLORS[log.result] ?? 'bg-slate-100 text-slate-600'}`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{log.riskLevel}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(log.verifiedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && <Pagination meta={meta} onPageChange={setPage} />}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="text-xs text-slate-500">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 block rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
        {options.map((o) => <option key={o} value={o}>{o || 'All'}</option>)}
      </select>
    </label>
  );
}
