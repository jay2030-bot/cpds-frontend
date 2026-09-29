import { Link } from "react-router-dom";

/**
 * Minimal landing page, primarily to give the app a working entry point for this
 * phase. The full marketing layout from spec section 28 (How It Works, For
 * Manufacturers / For Consumers, footer) is a later frontend-polish pass.
 */
export function LandingPage() {
  return (
    <div className="page-arrive min-h-screen overflow-hidden bg-[#f4f7f3]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="CPDS home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-sm font-extrabold text-white">
            C
          </span>
          <span>
            <span className="block font-extrabold leading-tight text-brand-900">
              CPDS
            </span>
            <span className="block text-[10px] font-semibold uppercase text-slate-500">
              Product verification
            </span>
          </span>
        </Link>
        <Link
          to="/login"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-brand-700"
        >
          Staff sign in <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl content-center gap-12 px-5 pb-14 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <section className="page-arrive max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1.5 text-xs font-bold uppercase text-brand-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Trusted
            product checks
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-brand-900 sm:text-5xl">
            Know what’s in your hands.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
            Check a product’s verification code to review its authenticity
            status and manufacturer details.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/scan"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-900/10 transition hover:-translate-y-0.5 hover:bg-brand-900"
            >
              <span aria-hidden="true">▦</span> Scan a QR code
            </Link>
            <Link
              to="/verify"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
            >
              Enter code manually
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-5 text-xs font-medium text-slate-500">
            <span>
              <span className="mr-2 text-emerald-600">●</span>Quick QR checks
            </span>
            <span>
              <span className="mr-2 text-emerald-600">●</span>Clear status
              results
            </span>
            <span>
              <span className="mr-2 text-emerald-600">●</span>Manufacturer
              details
            </span>
          </div>
        </section>

        <section
          className="relative mx-auto w-full max-w-md lg:justify-self-end"
          aria-label="Verification preview"
        >
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-citrus-100" />
          <div className="relative rounded-2xl bg-brand-900 p-6 text-white shadow-2xl shadow-brand-900/15 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-brand-100">
                CPDS check
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-citrus-100">
                Simple & secure
              </span>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div
                className="grid h-16 w-16 place-items-center rounded-2xl bg-citrus-100 text-3xl text-brand-900"
                aria-hidden="true"
              >
                ✓
              </div>
              <div>
                <p className="text-lg font-bold">Check before you buy</p>
                <p className="mt-1 text-sm text-brand-100">
                  Scan the code on the product label.
                </p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/15 pt-5 text-center">
              <div>
                <p className="text-xl font-extrabold text-citrus-100">01</p>
                <p className="mt-1 text-[10px] uppercase text-brand-100">
                  Scan
                </p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-citrus-100">02</p>
                <p className="mt-1 text-[10px] uppercase text-brand-100">
                  Check
                </p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-citrus-100">03</p>
                <p className="mt-1 text-[10px] uppercase text-brand-100">
                  Review
                </p>
              </div>
            </div>
          </div>
          <p className="relative mt-4 text-center text-xs text-slate-500">
            A verification result is one useful signal. Buy from trusted
            sellers.
          </p>
        </section>
      </main>
    </div>
  );
}
