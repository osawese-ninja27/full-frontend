import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { TopBar } from "../../app/ui";
import * as api from "../../lib/api";
import type { Gamification } from "../../types";
export default function GamificationPage(){
  const { token } = useAuth();
  const [g,setG]=useState<Gamification|null>(null); const [lb,setLb]=useState<{full_name:string;points:number}[]>([]);
  useEffect(()=>{ if(token){ api.getGamification(token).then(setG).catch(()=>{}); api.getLeaderboard(token).then(setLb).catch(()=>{}); } },[token]);
  return (<div className="min-h-screen bg-slate-50"><TopBar title="My Progress" links={[{to:"/student",label:"Dashboard"}]}/>
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="text-2xl font-bold text-slate-800">{g?.total_points ?? 0}</div><div className="mt-1 text-sm text-slate-500">Total points</div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="text-2xl font-bold text-slate-800">🔥 {g?.current_streak ?? 0}</div><div className="mt-1 text-sm text-slate-500">Current streak</div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><div className="text-2xl font-bold text-slate-800">{g?.longest_streak ?? 0}</div><div className="mt-1 text-sm text-slate-500">Longest streak</div></div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Badges</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(!g||g.badges.length===0)&&<p className="text-sm text-slate-400">No badges yet. Pass a module quiz to earn one.</p>}
          {g?.badges.map(b=><span key={b.code} className="rounded-lg bg-amber-50 px-3 py-2 text-sm"><span className="font-medium text-amber-800">🏅 {b.name}</span><span className="ml-1 text-amber-600">— {b.description}</span></span>)}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Leaderboard</h2>
        {lb.map((r,i)=><div key={i} className="mt-2 flex justify-between text-sm"><span className="text-slate-700">{i+1}. {r.full_name}</span><span className="font-medium text-slate-800">{r.points} pts</span></div>)}
        {lb.length===0&&<p className="mt-2 text-sm text-slate-400">No ranked students yet.</p>}
      </div>
    </main></div>);
}
