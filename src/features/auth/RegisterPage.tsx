import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ApiError } from "../../lib/api";
import { Input, Button } from "../../app/ui";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await register({ email, password, full_name, role });
      nav("/login");
    } catch (x) {
      setErr(x instanceof ApiError ? x.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 font-display text-sm font-bold">MB</span>
          <span className="font-display text-lg font-bold">MentorBridge</span>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            Join as a student
            <br />
            or a mentor.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-brand-100">
            Track progress, stay accountable, and get help exactly when it's needed most.
          </p>
        </div>
        <p className="text-xs text-brand-200">Learning Support System</p>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="flex w-full items-center justify-center bg-slate-50 px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[var(--shadow-card)]">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-bold text-white lg:hidden">MB</div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">Get started with MentorBridge.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input placeholder="Full name" value={full_name} onChange={(e) => setName(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password (min 8)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
            </select>
            {err && <p className="rounded-lg bg-alert-50 px-3 py-2 text-sm text-alert-700">{err}</p>}
            <Button disabled={busy} className="w-full !py-2.5">
              {busy ? "Creating..." : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}