import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { TopBar } from "../../app/ui";
import * as api from "../../lib/api";
import Conversation from "./Conversation";
export default function StudentMentors(){
  const { token } = useAuth();
  const [mentors,setMentors]=useState<{mentorship_id:string;mentor_name:string}[]>([]); const [active,setActive]=useState<string|null>(null);
  useEffect(()=>{ if(token) api.myMentors(token).then(setMentors).catch(()=>{}); },[token]);
  return (<div className="min-h-screen bg-slate-50"><TopBar title="My Mentors" links={[{to:"/student",label:"Dashboard"}]}/>
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      {mentors.length===0 && <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">No mentor assigned yet. Ask your mentor to add you using your user ID: <span className="font-mono">{useAuth().user?.id}</span></p>}
      {mentors.map(m=>(<div key={m.mentorship_id} className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between"><span className="font-medium text-slate-800">{m.mentor_name}</span><button onClick={()=>setActive(active===m.mentorship_id?null:m.mentorship_id)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">{active===m.mentorship_id?"Close":"Message"}</button></div>
        {active===m.mentorship_id && <Conversation mentorshipId={m.mentorship_id}/>}
      </div>))}
    </main></div>);
}
