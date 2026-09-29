import { Suspense, lazy, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { extractTokenFromScan } from "../utils/extractToken";

// html5-qrcode is a sizeable library only needed on this one route, so it's kept out
// of the main bundle and fetched on demand when someone actually opens the scanner.
const QrScanner = lazy(() =>
  import("../components/QrScanner").then((m) => ({ default: m.QrScanner })),
);

/**
 * Route: /scan
 * Flow (spec section 17): Open Scanner -> Camera Permission -> Scan QR ->
 * Extract Verification Token -> navigate to /verify/:token, which performs
 * the actual verification call and shows the result.
 */
export function ScanPage() {
  const navigate = useNavigate();
  const [unavailableReason, setUnavailableReason] = useState<string | null>(
    null,
  );

  function handleDetected(rawText: string) {
    const token = extractTokenFromScan(rawText);
    navigate(`/verify/${encodeURIComponent(token)}`);
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

      <div className="w-full max-w-sm text-center">
        <p className="text-xs font-bold uppercase text-brand-600">
          Product check
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
          Scan the QR code
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Hold the code steady inside the camera view.
        </p>
      </div>

      {!unavailableReason && (
        <Suspense
          fallback={<p className="text-sm text-slate-500">Loading scanner…</p>}
        >
          <QrScanner
            onDetected={handleDetected}
            onUnavailable={setUnavailableReason}
          />
        </Suspense>
      )}

      {unavailableReason && (
        <div className="w-full max-w-sm rounded-xl border border-amber-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-amber-800">
            Camera Unavailable
          </p>
          <p className="mt-2 text-xs text-slate-600">{unavailableReason}</p>
          <p className="mt-2 text-xs text-slate-500">
            This can happen if camera permission was denied, no camera is
            available, or the page isn't served over HTTPS.
          </p>
          <Link
            to="/verify"
            className="mt-4 inline-block w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Enter Code Manually Instead
          </Link>
        </div>
      )}

      <Link
        to="/verify"
        className="text-sm font-medium text-slate-500 hover:text-brand-700 hover:underline"
      >
        Having trouble? Enter the code manually
      </Link>
    </div>
  );
}
