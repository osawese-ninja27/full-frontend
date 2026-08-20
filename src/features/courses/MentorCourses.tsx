import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { TopBar, Badge } from "../../app/ui";
import * as api from "../../lib/api";
import type { Course } from "../../types";
export default function MentorCourses(){
  const { token } = useAuth();
  const [courses,setCourses]=useState<Course[]>([]); const [title,setTitle]=useState(""); const [desc,setDesc]=useState("");
  async function refresh(){ if(token) setCourses(await api.listMyCourses(token)); }
  useEffect(()=>{ refresh(); },[token]);
  async function create(){ if(!token||!title) return; await api.createCourse(token,{title,description:desc}); setTitle(""); setDesc(""); refresh(); }
  async function toggle(c:Course){ if(!token) return; c.is_published?await api.unpublishCourse(token,c.id):await api.publishCourse(token,c.id); refresh(); }
  async function del(id:string){ if(!token||!confirm("Delete this course?")) return; await api.deleteCourse(token,id); refresh(); }
  return (<div className="min-h-screen bg-slate-50"><TopBar title="My Courses" links={[{to:"/mentor",label:"Dashboard"}]}/>
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800">Create a course</h2>
        <div className="mt-4 space-y-3">
          <input placeholder="Course title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2"/>
          <textarea placeholder="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2"/>
          <button onClick={create} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Create course</button>
        </div>
      </div>
      <div className="space-y-3">
        {courses.length===0 && <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">No courses yet.</p>}
        {courses.map(c=>(<div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
          <div><div className="flex items-center gap-2"><span className="font-medium text-slate-800">{c.title}</span><Badge color={c.is_published?"green":"amber"}>{c.is_published?"Published":"Draft"}</Badge></div>{c.description&&<p className="mt-1 text-sm text-slate-500">{c.description}</p>}</div>
          <div className="flex items-center gap-2">
            <Link to={`/mentor/courses/${c.id}`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">Build</Link>
            <button onClick={()=>toggle(c)} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">{c.is_published?"Unpublish":"Publish"}</button>
            <button onClick={()=>del(c.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100">Delete</button>
          </div>
        </div>))}
      </div>
    </main></div>);
}
