import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { TopBar } from "../../app/ui";
import * as api from "../../lib/api";
export default function StudentDashboard(){
  const { user, token } = useAuth();
  const [d,setD]=useState<{enrolled_courses:number;total_points:number;current_streak:number}|null>(null);
  useEffect(()=>{ if(token) api.studentDashboard(token).then(setD).catch(()=>{}); },[token]);
  return (<div className="min-h-screen bg-slate-50"><TopBar title="Student Dashboard" links={[{to:"/student/catalogue",label:"Browse Courses"},{to:"/student/mentors",label:"My Mentors"},{to:"/student/gamification",label:"My Progress"}]}/>
    <main className="mx-auto max-w-4xl p-6">
      <p className="text-slate-700">Welcome, <span className="font-semibold">{user?.full_name}</span>.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Enrolled courses" value={d?.enrolled_courses ?? "-"}/>
        <Stat label="Total points" value={d?.total_points ?? "-"}/>
        <Stat label="Current streak" value={d?.current_streak ?? "-"}/>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link to="/student/catalogue" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400"><div className="font-medium text-slate-800">Browse Courses</div><div className="mt-1 text-sm text-slate-500">Enrol and start learning.</div></Link>
        <Link to="/student/gamification" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400"><div className="font-medium text-slate-800">My Progress & Badges</div><div className="mt-1 text-sm text-slate-500">Points, streak, leaderboard.</div></Link>
      </div>
    </main></div>);
}
function Stat({label,value}:{label:string;value:React.ReactNode}){ return <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="text-2xl font-bold text-slate-800">{value}</div><div className="mt-1 text-sm text-slate-500">{label}</div></div>; }
