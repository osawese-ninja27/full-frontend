import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { TopBar } from "../../app/ui";
import * as api from "../../lib/api";
import Conversation from "./Conversation";
export default function MentorStudents(){
  const { token } = useAuth();
  const [students,setStudents]=useState<{mentorship_id:string;student_name:string;student_email:string;student_id:string}[]>([]);
  const [sid,setSid]=useState(""); const [active,setActive]=useState<string|null>(null); const [err,setErr]=useState<string|null>(null);
  async function refresh(){ if(token) setStudents(await api.myStudents(token)); }
  useEffect(()=>{ refresh(); },[token]);
  async function assign(){
    if(!token||!sid) return;
    try{
      await api.req("/mentor/students",{method:"POST",body:{student_id:sid},token});
      setSid(""); setErr(null); refresh();
    }catch(x){ setErr((x as Error).message); }
  }
  return (<div className="min-h-screen bg-slate-50"><TopBar title="My Students" links={[{to:"/mentor",label:"Dashboard"}]}/>
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800">Assign a student</h2>
        <p className="mt-1 text-xs text-slate-400">Paste the student's user ID (from their profile) to add them as a mentee.</p>
        <div className="mt-3 flex gap-2"><input placeholder="Student user ID (UUID)" value={sid} onChange={e=>setSid(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2"/><button onClick={assign} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Assign</button></div>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </div>
      <div className="space-y-2">
        {students.length===0 && <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">No mentees yet.</p>}
        {students.map(s=>(<div key={s.mentorship_id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between"><div><div className="font-medium text-slate-800">{s.student_name}</div><div className="text-sm text-slate-500">{s.student_email}</div></div>
          <button onClick={()=>setActive(active===s.mentorship_id?null:s.mentorship_id)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">{active===s.mentorship_id?"Close":"Message"}</button></div>
          {active===s.mentorship_id && <Conversation mentorshipId={s.mentorship_id}/>}
        </div>))}
      </div>
    </main></div>);
}
