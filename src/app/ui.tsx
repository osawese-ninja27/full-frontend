import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

/* ---------- Top Navigation (single source of truth for nav) ---------- */

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const isMentor = user?.role === "mentor";
  const isAdmin = user?.role === "admin";

  const links = isAdmin
    ? [{ to: "/admin", label: "Admin" }]
    : isMentor
    ? [
        { to: "/mentor/dashboard", label: "Dashboard" },
        { to: "/mentor/courses", label: "My Courses" },
        { to: "/mentor/courses/new", label: "Course Builder" },
        { to: "/mentor/students", label: "My Students" },
      ]
    : [
        { to: "/student/dashboard", label: "Dashboard" },
        { to: "/catalogue", label: "Course Catalogue" },
        { to: "/student/mentors", label: "Find Mentors" },
      ];

  const initials = (user?.full_name || user?.email || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to={isAdmin ? "/admin" : isMentor ? "/mentor/dashboard" : "/student/dashboard"} className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-bold text-white">
            MB
          </span>
          <span className="font-display text-[15px] font-bold text-slate-900 hidden sm:block">
            MentorBridge
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:block text-right leading-tight">
            <span className="block text-sm font-medium text-slate-800">{user?.full_name}</span>
            <span className="block text-xs capitalize text-slate-400">{user?.role}</span>
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initials}
          </div>
          <button
            onClick={logout}
            className="hidden sm:inline-flex rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Log out
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="mt-2 w-full rounded-lg bg-slate-100 px-3.5 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Log out
          </button>
        </nav>
      )}
    </header>
  );
}

/* ---------- Page shell ---------- */

export function Page({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</p>
      )}
      <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function Container({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <main className={`mx-auto ${wide ? "max-w-6xl" : "max-w-4xl"} px-4 py-8 sm:px-6`}>{children}</main>;
}

/* ---------- Cards & primitives ---------- */

export function Card({ children, className = "", href, to, onClick }: { children: ReactNode; className?: string; href?: string; to?: string; onClick?: () => void }) {
  const base = `rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] transition ${className}`;
  if (to) {
    return (
      <Link to={to} className={`${base} hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]`}>
        {children}
      </Link>
    );
  }
  if (href || onClick) {
    return (
      <button onClick={onClick} className={`${base} text-left hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-card-hover)]`}>
        {children}
      </button>
    );
  }
  return <div className={base}>{children}</div>;
}

const statColorMap: Record<string, { chip: string; icon: string }> = {
  brand: { chip: "bg-brand-50 text-brand-600", icon: "text-brand-600" },
  gold: { chip: "bg-gold-50 text-gold-600", icon: "text-gold-600" },
  success: { chip: "bg-success-50 text-success-600", icon: "text-success-600" },
  alert: { chip: "bg-alert-50 text-alert-600", icon: "text-alert-600" },
};

export function StatCard({
  label,
  value,
  color = "brand",
  icon,
}: {
  label: string;
  value: ReactNode;
  color?: "brand" | "gold" | "success" | "alert";
  icon?: ReactNode;
}) {
  const c = statColorMap[color];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <div className="font-display text-3xl font-bold text-slate-900">{value}</div>
        {icon && <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.chip}`}>{icon}</div>}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-500">{label}</div>
    </div>
  );
}

export function Badge({ children, color = "slate" }: { children: ReactNode; color?: string }) {
  const map: Record<string, string> = {
    green: "bg-success-100 text-success-700",
    amber: "bg-gold-100 text-gold-700",
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-brand-100 text-brand-700",
    red: "bg-alert-100 text-alert-700",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[color]}`}>{children}</span>;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const variants: Record<string, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
    danger: "bg-alert-50 text-alert-700 hover:bg-alert-100",
    ghost: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  };
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 ${props.className ?? ""}`}
    />
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
      {children}
    </p>
  );
}