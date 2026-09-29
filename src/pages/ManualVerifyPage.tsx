import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { VerificationResultCard } from "../components/VerificationResultCard";
import { extractErrorMessage } from "../services/api";
import { verifyManualCode } from "../services/verification.service";
import { VerificationResponse } from "../types/verification";

/** Route: /verify — manual fallback when scanning isn't possible. */
export function ManualVerifyPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await verifyManualCode(code);
      setResult(res);
    } catch (err) {
      setError(
        extractErrorMessage(err, "Could not check this code right now."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-arrive flex min-h-screen flex-col items-center gap-6 bg-[#f4f7f3] px-4 py-8 sm:py-12">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-extrabold text-brand-900"
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-900 text-white">
          C
        </span>{" "}
        CPDS
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-brand-900/5 sm:p-8">
        <p className="text-xs font-bold uppercase text-brand-600">
          Manual verification
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
          Enter product code
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Type the verification code printed on the product label.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CPDS-XXXX-XXXX-XXXX-XXXX"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={submitting || !code.trim()}
            className="w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-900/10 transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Verifying…" : "Verify Product"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {result && <VerificationResultCard result={result} />}

      <Link
        to="/scan"
        className="text-sm font-medium text-slate-500 hover:text-brand-700 hover:underline"
      >
        Prefer to scan a QR code?
      </Link>
    </div>
  );
}
