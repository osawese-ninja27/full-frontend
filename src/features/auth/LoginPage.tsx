import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ApiError } from "../../lib/api";
export default function LoginPage(){
  const { login } = useAuth(); const nav = useNavigate();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [err,setErr]=useState<string|null>(null); const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent){ e.preventDefault(); setErr(null); setBusy(true);
    try{ const user = await login(email,password); nav(user.role === "mentor" ? "/mentor/dashboard" : "/student/dashboard"); }catch(x){ setErr(x instanceof ApiError?x.message:"Login failed"); }finally{ setBusy(false);} }
  return (<div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
      <h1 className="text-2xl font-bold text-slate-800">Sign in</h1>
      <p className="mt-1 text-sm text-slate-500">Strict Distance Learning</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"/>
        {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{busy?"Signing in...":"Sign in"}</button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">No account? <Link to="/register" className="font-medium text-blue-600 hover:underline">Register</Link></p>
    </div></div>);
}
