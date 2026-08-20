import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ApiError } from "../../lib/api";
import { Input, Button } from "../../app/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const user = await login(email, password);
      nav(user.role === "admin" ? "/admin" : user.role === "mentor" ? "/mentor/dashboard" : "/student/dashboard");
    } catch (x) {
      setErr(x instanceof ApiError ? x.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 font-display text-sm font-bold">MB</span>
          <span className="font-display text-lg font-bold">MentorBridge</span>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            Catch students early,
            <br />
            before students fall behind.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-brand-100">
            Early-warning signals and mentor dashboards designed to catch students early — not after final grades.
          </p>
        </div>
        <p className="text-xs text-brand-200">Learning Support System</p>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-4 lg:w-1/2">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[var(--shadow-card)]">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-bold text-white lg:hidden">MB</div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back to MentorBridge.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {err && <p className="rounded-lg bg-alert-50 px-3 py-2 text-sm text-alert-700">{err}</p>}
            <Button disabled={busy} className="w-full !py-2.5">
              {busy ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            No account?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}