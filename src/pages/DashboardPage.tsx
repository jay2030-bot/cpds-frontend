import { useEffect, useState } from "react";
import { ActivityChart } from "../components/ActivityChart";
import { StatCard } from "../components/StatCard";
import { TopProductsList } from "../components/TopProductsList";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../services/api";
import { fetchDashboard } from "../services/dashboard.service";
import { DashboardResponse } from "../types/dashboard";

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchDashboard(user.role)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading)
    return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return null;

  const {
    stats,
    activityOverTime,
    topVerifiedProducts,
    recentSuspiciousActivity,
  } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-brand-600">Overview</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
            {user?.role === "ADMIN"
              ? "Admin dashboard"
              : "Manufacturer dashboard"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A live view of product checks and recent activity.
          </p>
        </div>
        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          ● System overview
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard
          label="Active Products"
          value={stats.activeProducts}
          tone="success"
        />
        <StatCard
          label="Deactivated Products"
          value={stats.deactivatedProducts}
          tone="warning"
        />
        <StatCard
          label="Verification Codes"
          value={stats.totalVerificationCodes}
        />
        <StatCard
          label="Total Verifications"
          value={stats.totalVerifications}
        />
        <StatCard
          label="Genuine"
          value={stats.genuineVerifications}
          tone="success"
        />
        <StatCard
          label="Suspicious"
          value={stats.suspiciousVerifications}
          tone="warning"
        />
        <StatCard
          label="Invalid Attempts"
          value={stats.invalidAttempts}
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-slate-800">
            Verification activity{" "}
            <span className="ml-1 font-medium text-slate-400">
              / last 14 days
            </span>
          </h2>
          <ActivityChart points={activityOverTime} />
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-800">
            Top verified products
          </h2>
          <TopProductsList products={topVerifiedProducts} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-800">
          Recent suspicious activity
        </h2>
        {recentSuspiciousActivity.length === 0 ? (
          <p className="text-sm text-slate-400">
            No suspicious activity recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase text-slate-500">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Code</th>
                  <th className="py-2 pr-4">Risk</th>
                  <th className="py-2 pr-4">When</th>
                </tr>
              </thead>
              <tbody>
                {recentSuspiciousActivity.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/70 last:border-0"
                  >
                    <td className="py-2 pr-4 font-medium text-slate-800">
                      {log.verificationCode?.product.name ?? "—"}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-slate-500">
                      {log.verificationCode?.verificationToken ??
                        log.enteredCode}
                    </td>
                    <td className="py-2 pr-4">
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-slate-500">
                      {new Date(log.verifiedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
