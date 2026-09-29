import { TopVerifiedProduct } from '../types/dashboard';

export function TopProductsList({ products }: { products: TopVerifiedProduct[] }) {
  if (products.length === 0) return <p className="text-sm text-slate-400">No verification activity yet.</p>;
  const max = Math.max(...products.map((p) => p.verificationCount));

  return (
    <ul className="flex flex-col gap-3">
      {products.map((p) => (
        <li key={p.productId}>
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-800">{p.name}</span>
            <span className="text-slate-500">{p.verificationCount}</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
            <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${(p.verificationCount / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
