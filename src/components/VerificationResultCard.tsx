import { VerificationResponse } from "../types/verification";

const STATUS_STYLES: Record<
  VerificationResponse["status"],
  { badge: string; ring: string; icon: string; label: string }
> = {
  GENUINE: {
    badge: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-200",
    icon: "✓",
    label: "Verified",
  },
  SUSPICIOUS: {
    badge: "bg-amber-100 text-amber-800",
    ring: "ring-amber-200",
    icon: "⚠",
    label: "Suspicious",
  },
  INVALID: {
    badge: "bg-red-100 text-red-800",
    ring: "ring-red-200",
    icon: "✕",
    label: "Invalid",
  },
  DEACTIVATED: {
    badge: "bg-slate-200 text-slate-700",
    ring: "ring-slate-300",
    icon: "⚠",
    label: "Deactivated",
  },
  EXPIRED: {
    badge: "bg-amber-100 text-amber-800",
    ring: "ring-amber-200",
    icon: "⚠",
    label: "Expired",
  },
};

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

/**
 * Renders any of the five verification outcomes from the API. Deliberately never adds
 * its own claims about authenticity — every word of status/message/detail comes straight
 * from the backend, which is the single source of truth for this language (spec section 43:
 * never assert "100% guaranteed genuine").
 */
export function VerificationResultCard({
  result,
}: {
  result: VerificationResponse;
}) {
  const style = STATUS_STYLES[result.status];

  return (
    <div
      className={`page-arrive w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-brand-900/5 ${style.ring}`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${style.badge}`}
          aria-hidden="true"
        >
          {style.icon}
        </div>
        <span
          className={`mt-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style.badge}`}
        >
          {style.label}
        </span>
        <h1 className="mt-3 text-xl font-extrabold text-slate-900">
          {result.message}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {result.detail}
        </p>
      </div>

      {result.product && (
        <dl className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-sm">
          <Row label="Product" value={result.product.name} />
          <Row label="Manufacturer" value={result.product.manufacturer} />
          <Row label="Category" value={result.product.category} />
          <Row label="Batch" value={result.product.batchNumber} />
          {result.product.manufactureDate && (
            <Row
              label="Manufactured"
              value={formatDate(result.product.manufactureDate)}
            />
          )}
          {result.product.expiryDate && (
            <Row
              label="Expires"
              value={formatDate(result.product.expiryDate)}
            />
          )}
          {typeof result.verificationCount === "number" && (
            <Row
              label="Verification"
              value={ordinal(result.verificationCount) + " check"}
            />
          )}
        </dl>
      )}

      {result.status === "SUSPICIOUS" && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Please verify that you purchased this product from an authorized
          seller. If in doubt, contact the manufacturer directly.
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
