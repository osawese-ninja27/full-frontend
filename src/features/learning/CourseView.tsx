import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { TopBar, Badge } from "../../app/ui";
import * as api from "../../lib/api";
import type { ModuleProgress, Lesson, Assessment } from "../../types";
import { useFocusMonitor } from "./useFocusMonitor";

export default function CourseView(){
  const { courseId } = useParams(); const { token } = useAuth();
  const [progress,setProgress]=useState<ModuleProgress[]>([]);
  const refresh=useCallback(async()=>{ if(token&&courseId) setProgress(await api.getProgress(token,courseId)); },[token,courseId]);
  useEffect(()=>{ refresh(); },[refresh]);
  return (<div className="min-h-screen bg-slate-50"><TopBar title="Course" links={[{to:"/student/catalogue",label:"Catalogue"}]}/>
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <p className="text-sm text-slate-500">Modules unlock in order. You must pass each module's quiz to unlock the next — this is the strict progression gate.</p>
      {progress.map((m,i)=><ModuleBlock key={m.module_id} m={m} index={i} onChange={refresh}/>)}
    </main></div>);
}

function ModuleBlock({m,index,onChange}:{m:ModuleProgress;index:number;onChange:()=>void}){
  const { token } = useAuth();
  const [lessons,setLessons]=useState<Lesson[]>([]); const [expanded,setExpanded]=useState(false); const [err,setErr]=useState<string|null>(null);
  async function toggle(){ if(!expanded && token){ try{ setLessons(await api.listLessons(token,m.module_id)); setErr(null);}catch(x){ setErr("Locked"); } } setExpanded(!expanded); }
  return (<div className={`rounded-xl border bg-white p-4 ${m.unlocked?"border-slate-200":"border-slate-200 opacity-70"}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-800">Module {index+1}: {m.title}</span>
        {!m.unlocked && <Badge color="slate">🔒 Locked</Badge>}
        {m.unlocked && !m.completed && <Badge color="amber">In progress</Badge>}
        {m.completed && <Badge color="green">✓ Completed{m.best_score!==null?` (${m.best_score}%)`:""}</Badge>}
      </div>
      {m.unlocked && <button onClick={toggle} className="text-sm text-blue-600 hover:underline">{expanded?"Hide":"Open"}</button>}
    </div>
    {!m.unlocked && <p className="mt-2 text-xs text-slate-400">Pass the previous module's quiz (≥ {m.min_pass_score}%) to unlock.</p>}
    {expanded && m.unlocked && <div className="mt-4 space-y-3">
      {err && <p className="text-sm text-red-600">{err}</p>}
      {lessons.map(l=><LessonView key={l.id} lesson={l}/>)}
      <AssessmentPanel moduleId={m.module_id} passScore={m.min_pass_score} onPassed={onChange}/>
    </div>}
  </div>);
}

function LessonView({lesson}:{lesson:Lesson}){
  // Starting to read a lesson opens a monitored session (focus monitoring).
  const monitor = useFocusMonitor(lesson.id);
  return (<div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
    <div className="flex items-center justify-between">
      <h4 className="font-medium text-slate-700">{lesson.title}</h4>
      {!monitor.active
        ? <button onClick={monitor.start} className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Start studying</button>
        : <span className="text-xs text-green-600">● Monitored session active</span>}
    </div>
    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{lesson.content}</p>
    {monitor.active && <div className="mt-2 rounded bg-white p-2 text-xs text-slate-500">
      Focus events: {monitor.negativeEvents}. {monitor.terminated && <span className="font-semibold text-red-600">Session terminated for inattention.</span>}
      <button onClick={monitor.stop} className="ml-2 rounded bg-slate-200 px-2 py-0.5">End session</button>
    </div>}
  </div>);
}

function AssessmentPanel({moduleId,passScore,onPassed}:{moduleId:string;passScore:number;onPassed:()=>void}){
  const { token } = useAuth();
  const [a,setA]=useState<Assessment|null>(null); const [answers,setAnswers]=useState<Record<string,string>>({});
  const [result,setResult]=useState<{score:number;passed:boolean}|null>(null); const [none,setNone]=useState(false);
  async function load(){ if(!token) return; try{ setA(await api.getAssessment(token,moduleId)); }catch{ setNone(true);} }
  useEffect(()=>{ load(); },[token]);
  async function submit(){ if(!token) return; const r=await api.submitAssessment(token,moduleId,answers); setResult(r); if(r.passed) onPassed(); }
  if(none) return <p className="text-xs text-slate-400">No quiz for this module.</p>;
  if(!a) return null;
  return (<div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
    <h4 className="font-medium text-slate-700">Quiz (pass ≥ {passScore}%)</h4>
    {a.questions.map(q=><div key={q.id} className="mt-2">
      <p className="text-sm text-slate-700">{q.prompt}</p>
      {q.options.map(o=><label key={o.id} className="mt-1 flex items-center gap-2 text-sm text-slate-600">
        <input type="radio" name={q.id} onChange={()=>setAnswers({...answers,[q.id]:o.id})}/>{o.text}</label>)}
    </div>)}
    <button onClick={submit} className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Submit quiz</button>
    {result && <p className={`mt-2 text-sm font-medium ${result.passed?"text-green-700":"text-red-700"}`}>Score: {result.score}% — {result.passed?"Passed! Next module unlocked.":"Not passed, try again."}</p>}
  </div>);
}
