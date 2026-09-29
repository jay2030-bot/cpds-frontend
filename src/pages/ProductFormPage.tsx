import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../services/api';
import { listManufacturers } from '../services/manufacturers.service';
import { createProduct } from '../services/products.service';
import { Manufacturer } from '../types/manufacturer';

export function ProductFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [form, setForm] = useState({
    manufacturerId: '', name: '', productCode: '', category: '', description: '',
    batchNumber: '', serialNumber: '', manufactureDate: '', expiryDate: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      listManufacturers({ limit: 100 }).then((res) => setManufacturers(res.items)).catch(() => {});
    }
  }, [isAdmin]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const product = await createProduct({
        ...form,
        manufacturerId: isAdmin ? form.manufacturerId : undefined,
        description: form.description || undefined,
        serialNumber: form.serialNumber || undefined,
        manufactureDate: form.manufactureDate || undefined,
        expiryDate: form.expiryDate || undefined,
      });
      navigate(`/products/${product.id}`, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not create the product.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Register a Product</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {isAdmin && (
          <Field label="Manufacturer">
            <select required value={form.manufacturerId} onChange={(e) => set('manufacturerId', e.target.value)} className={inputClass}>
              <option value="">Select a manufacturer…</option>
              {manufacturers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="Product Name">
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product Code">
            <input required value={form.productCode} onChange={(e) => set('productCode', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Category">
            <input required value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Batch Number">
            <input required value={form.batchNumber} onChange={(e) => set('batchNumber', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Serial Number (optional)">
            <input value={form.serialNumber} onChange={(e) => set('serialNumber', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Manufacture Date">
            <input type="date" value={form.manufactureDate} onChange={(e) => set('manufactureDate', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Expiry Date">
            <input type="date" value={form.expiryDate} onChange={(e) => set('expiryDate', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Description (optional)">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} rows={3} />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit" disabled={submitting}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
