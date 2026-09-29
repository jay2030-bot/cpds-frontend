import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractErrorMessage } from '../services/api';
import { createManufacturer } from '../services/manufacturers.service';

export function ManufacturerFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', registrationNumber: '' });
  const [createLogin, setCreateLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function setLogin<K extends keyof typeof loginForm>(key: K, value: string) {
    setLoginForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const manufacturer = await createManufacturer({
        ...form,
        registrationNumber: form.registrationNumber || undefined,
        adminUser: createLogin ? loginForm : undefined,
      });
      navigate('/manufacturers', { replace: true, state: { createdId: manufacturer.id } });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not create the manufacturer.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">New Manufacturer</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <Field label="Company Name">
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input required value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Address">
          <input required value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Registration Number (optional)">
          <input value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)} className={inputClass} />
        </Field>

        <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={createLogin} onChange={(e) => setCreateLogin(e.target.checked)} />
          Also create a login for this manufacturer
        </label>

        {createLogin && (
          <div className="flex flex-col gap-4 rounded-lg bg-slate-50 p-4">
            <Field label="Contact Name">
              <input required={createLogin} value={loginForm.name} onChange={(e) => setLogin('name', e.target.value)} className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Login Email">
                <input type="email" required={createLogin} value={loginForm.email} onChange={(e) => setLogin('email', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Temporary Password">
                <input
                  type="text" required={createLogin} minLength={8} value={loginForm.password}
                  onChange={(e) => setLogin('password', e.target.value)} className={inputClass}
                />
              </Field>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit" disabled={submitting}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create Manufacturer'}
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
