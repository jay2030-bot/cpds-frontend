import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { VerificationResultCard } from "../components/VerificationResultCard";
import { extractErrorMessage } from "../services/api";
import { verifyByToken } from "../services/verification.service";
import { VerificationResponse } from "../types/verification";

/** Route: /verify/:token — this is exactly what the QR code's embedded URL points at. */
export function VerifyResultPage() {
  const { token } = useParams<{ token: string }>();
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    verifyByToken(token)
      .then((res) => {
        if (!cancelled) setResult(res);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            extractErrorMessage(err, "Could not check this code right now."),
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="page-arrive flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f4f7f3] px-4 py-10">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-extrabold text-brand-900"
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-900 text-white">
          C
        </span>{" "}
        CPDS
      </Link>

      {loading && <LoadingCard />}

      {!loading && error && (
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-extrabold text-red-700">
            Could not check this code
          </p>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <Link
            to="/verify"
            className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline"
          >
            Try entering the code manually
          </Link>
        </div>
      )}

      {!loading && !error && result && (
        <VerificationResultCard result={result} />
      )}

      <Link
        to="/scan"
        className="text-sm text-slate-500 hover:text-brand-600 hover:underline"
      >
        Scan another product
      </Link>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="w-full max-w-md animate-pulse rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <div className="mx-auto h-16 w-16 rounded-full bg-slate-200" />
      <div className="mx-auto mt-4 h-4 w-40 rounded bg-slate-200" />
      <div className="mx-auto mt-2 h-3 w-56 rounded bg-slate-100" />
    </div>
  );
}
