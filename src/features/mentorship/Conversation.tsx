import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import * as api from "../../lib/api";
export default function Conversation({mentorshipId}:{mentorshipId:string}){
  const { token, user } = useAuth();
  const [msgs,setMsgs]=useState<{id:string;sender_id:string;body:string;sent_at:string}[]>([]); const [text,setText]=useState("");
  async function refresh(){ if(token) setMsgs(await api.getMessages(token,mentorshipId)); }
  useEffect(()=>{ refresh(); },[token,mentorshipId]);
  async function send(){ if(!token||!text) return; await api.sendMessage(token,mentorshipId,text); setText(""); refresh(); }
  return (<div className="mt-3 border-t pt-3">
    <div className="max-h-48 space-y-2 overflow-y-auto">
      {msgs.map(m=><div key={m.id} className={`text-sm ${m.sender_id===user?.id?"text-right":""}`}><span className={`inline-block rounded-lg px-3 py-1.5 ${m.sender_id===user?.id?"bg-blue-100 text-blue-900":"bg-slate-100 text-slate-700"}`}>{m.body}</span></div>)}
      {msgs.length===0 && <p className="text-sm text-slate-400">No messages yet.</p>}
    </div>
    <div className="mt-2 flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"/><button onClick={send} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Send</button></div>
  </div>);
}
