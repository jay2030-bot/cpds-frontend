import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", adminOnly: false },
  { to: "/products", label: "Products", adminOnly: false },
  { to: "/verifications", label: "Verification History", adminOnly: false },
  {
    to: "/verifications/suspicious",
    label: "Suspicious Activity",
    adminOnly: false,
  },
  { to: "/manufacturers", label: "Manufacturers", adminOnly: true },
];

/** Shell for every authenticated screen: sidebar nav + topbar with the signed-in user and sign-out. */
export function AppLayout() {
  const { user, logout } = useAuth();
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || user?.role === "ADMIN",
  );

  return (
    <div className="flex min-h-screen bg-[#f4f7f3]">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white px-4 py-6 sm:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-sm font-extrabold text-white">
            C
          </span>
          <span>
            <span className="block font-extrabold leading-tight text-brand-900">
              CPDS
            </span>
            <span className="text-[10px] font-semibold uppercase text-slate-400">
              Control centre
            </span>
          </span>
        </div>
        <p className="mb-2 px-3 text-[10px] font-bold uppercase text-slate-400">
          Workspace
        </p>
        <nav className="flex flex-col gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/verifications"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-[68px] items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{user?.name}</span>
            <span className="rounded-full bg-citrus-100 px-2.5 py-1 text-[10px] font-bold uppercase text-citrus-700">
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Sign out <span aria-hidden="true">↗</span>
          </button>
        </header>
        <nav
          className="flex gap-1 overflow-x-auto border-b border-slate-200/80 bg-white px-3 py-2 sm:hidden"
          aria-label="Workspace navigation"
        >
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/verifications"}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-500"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="page-arrive mx-auto w-full max-w-7xl flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
