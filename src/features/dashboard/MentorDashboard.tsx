import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { TopBar } from "../../app/ui";
import * as api from "../../lib/api";
export default function MentorDashboard(){
  const { user, token } = useAuth();
  const [d,setD]=useState<{my_courses:number;mentee_count:number;low_focus_students:{student_name:string;negative_events:number}[]}|null>(null);
  useEffect(()=>{ if(token) api.mentorDashboard(token).then(setD).catch(()=>{}); },[token]);
  return (<div className="min-h-screen bg-slate-50"><TopBar title="Mentor Dashboard" links={[{to:"/mentor/courses",label:"My Courses"},{to:"/mentor/students",label:"My Students"}]}/>
    <main className="mx-auto max-w-4xl p-6">
      <p className="text-slate-700">Welcome, <span className="font-semibold">{user?.full_name}</span>.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="text-2xl font-bold text-slate-800">{d?.my_courses ?? "-"}</div><div className="mt-1 text-sm text-slate-500">Courses</div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="text-2xl font-bold text-slate-800">{d?.mentee_count ?? "-"}</div><div className="mt-1 text-sm text-slate-500">Mentees</div></div>
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Low-focus students</h2>
        {(!d || d.low_focus_students.length===0) && <p className="mt-2 text-sm text-slate-400">No focus concerns flagged.</p>}
        {d?.low_focus_students.map((s,i)=><div key={i} className="mt-2 flex justify-between text-sm"><span className="text-slate-700">{s.student_name}</span><span className="text-red-600">{s.negative_events} events</span></div>)}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link to="/mentor/courses" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400"><div className="font-medium text-slate-800">Manage Courses</div><div className="mt-1 text-sm text-slate-500">Build modules, lessons, quizzes.</div></Link>
        <Link to="/mentor/students" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400"><div className="font-medium text-slate-800">My Students</div><div className="mt-1 text-sm text-slate-500">Assign and message mentees.</div></Link>
      </div>
    </main></div>);
}
