import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { TopBar } from "../../app/ui";
import * as api from "../../lib/api";
import type { Course } from "../../types";
export default function Catalogue(){
  const { token } = useAuth(); const nav = useNavigate();
  const [courses,setCourses]=useState<Course[]>([]);
  useEffect(()=>{ if(token) api.listCatalogue(token).then(setCourses).catch(()=>{}); },[token]);
  async function open(c:Course){ if(!token) return; try{ await api.enroll(token,c.id); }catch{} nav(`/student/courses/${c.id}`); }
  return (<div className="min-h-screen bg-slate-50"><TopBar title="Course Catalogue" links={[{to:"/student",label:"Dashboard"}]}/>
    <main className="mx-auto max-w-3xl p-6">
      {courses.length===0 && <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">No published courses yet.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {courses.map(c=>(<div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-medium text-slate-800">{c.title}</h3>{c.description&&<p className="mt-1 text-sm text-slate-500">{c.description}</p>}
          <button onClick={()=>open(c)} className="mt-3 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Enrol & open</button>
        </div>))}
      </div>
    </main></div>);
}
