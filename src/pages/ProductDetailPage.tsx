import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { extractErrorMessage } from '../services/api';
import { bulkGenerateCodes, downloadQrCode, generateCode, listCodesForProduct, setCodeStatus } from '../services/productCodes.service';
import { getProduct, updateProductStatus } from '../services/products.service';
import { Product, ProductStatus } from '../types/product';
import { ProductVerificationCode } from '../types/productCode';

const STATUS_OPTIONS: ProductStatus[] = ['ACTIVE', 'INACTIVE', 'RECALLED'];

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [codes, setCodes] = useState<ProductVerificationCode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [bulkQty, setBulkQty] = useState(10);

  const reload = useCallback(async () => {
    if (!id) return;
    const [p, c] = await Promise.all([getProduct(id), listCodesForProduct(id, { limit: 50 })]);
    setProduct(p);
    setCodes(c.items);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    reload().catch((err) => setError(extractErrorMessage(err))).finally(() => setLoading(false));
  }, [reload]);

  async function handleStatusChange(status: ProductStatus) {
    if (!product) return;
    setBusy(true);
    setActionError(null);
    try {
      const updated = await updateProductStatus(product.id, status);
      setProduct(updated);
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGenerateOne() {
    if (!product) return;
    setBusy(true);
    setActionError(null);
    try {
      await generateCode(product.id);
      await reload();
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleBulkGenerate(e: FormEvent) {
    e.preventDefault();
    if (!product) return;
    setBusy(true);
    setActionError(null);
    try {
      await bulkGenerateCodes(product.id, bulkQty);
      await reload();
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleCode(code: ProductVerificationCode) {
    setBusy(true);
    setActionError(null);
    try {
      await setCodeStatus(code.id, code.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE');
      await reload();
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!product) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{product.manufacturer.name} · {product.category}</p>
          </div>
          <StatusBadge status={product.status} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
          <Row label="Product Code" value={product.productCode} mono />
          <Row label="Batch" value={product.batchNumber} />
          <Row label="Manufactured" value={formatDate(product.manufactureDate)} />
          <Row label="Expires" value={formatDate(product.expiryDate)} />
        </dl>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">Change status:</span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s} disabled={busy || s === product.status} onClick={() => handleStatusChange(s)}
              className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {actionError && <p className="text-sm text-red-600">{actionError}</p>}

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-slate-700">Verification Codes ({codes.length})</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGenerateOne} disabled={busy}
              className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              + Generate One Code
            </button>
            <form onSubmit={handleBulkGenerate} className="flex items-center gap-2">
              <input
                type="number" min={1} max={1000} value={bulkQty}
                onChange={(e) => setBulkQty(Number(e.target.value))}
                className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
              />
              <button
                type="submit" disabled={busy}
                className="rounded-lg border border-brand-600 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-50"
              >
                Bulk Generate
              </button>
            </form>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="py-2 pr-4">Token</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Scans</th>
                <th className="py-2 pr-4">QR</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-slate-400">No verification codes yet.</td></tr>
              ) : (
                codes.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs">{c.verificationToken}</td>
                    <td className="py-2 pr-4"><StatusBadge status={c.status} /></td>
                    <td className="py-2 pr-4 text-slate-500">{c.verificationCount}</td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-2">
                        <button onClick={() => downloadQrCode(c.id, 'png', c.verificationToken)} className="text-xs text-brand-600 hover:underline">PNG</button>
                        <button onClick={() => downloadQrCode(c.id, 'svg', c.verificationToken)} className="text-xs text-brand-600 hover:underline">SVG</button>
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      {c.status !== 'EXPIRED' && (
                        <button
                          onClick={() => handleToggleCode(c)} disabled={busy}
                          className="text-xs font-medium text-slate-500 hover:text-red-600 disabled:opacity-40"
                        >
                          {c.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className={`font-medium text-slate-800 ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  );
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
