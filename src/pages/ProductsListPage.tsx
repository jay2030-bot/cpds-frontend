import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../services/api';
import { listProducts } from '../services/products.service';
import { PaginationMeta } from '../types/api';
import { Product } from '../types/product';

/**
 * Shared list for both roles: the backend already scopes results to the caller's own
 * manufacturer for a MANUFACTURER account (see ProductsService.scope), so one page
 * works for both without duplicating admin/manufacturer product screens.
 */
export function ProductsListPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listProducts({ page, limit: 10, search: search || undefined })
      .then((res) => { if (!cancelled) { setItems(res.items); setMeta(res.meta); } })
      .catch((err) => { if (!cancelled) setError(extractErrorMessage(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900">Products</h1>
        <Link to="/products/new" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + New Product
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        placeholder="Search by name, product code, or batch…"
        className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Batch</th>
              {user?.role === 'ADMIN' && <th className="px-4 py-3">Manufacturer</th>}
              <th className="px-4 py-3">Codes</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No products found.</td></tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/products/${p.id}`} className="font-medium text-brand-700 hover:underline">{p.name}</Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.productCode}</td>
                  <td className="px-4 py-3 text-slate-500">{p.batchNumber}</td>
                  {user?.role === 'ADMIN' && <td className="px-4 py-3 text-slate-500">{p.manufacturer.name}</td>}
                  <td className="px-4 py-3 text-slate-500">{p._count?.verificationCodes ?? 0}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
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
