import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl bg-white p-8 shadow-[var(--shadow-card)]">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Administration</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">Welcome, {user?.full_name}</h1>
        <p className="mt-3 max-w-xl text-slate-600">
          You are signed in with administrator access. Admin tools can be added here as they become available.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Return to sign in
        </Link>
      </div>
    </main>
  );
}