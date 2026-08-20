import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import * as api from "../../lib/api";

// Phase 7 client: opens a monitored session and reports focus events to the
// server. Detection is client-side (only the browser sees tab visibility and
// activity); judgement/persistence is server-side. The server decides when a
// session should be terminated for inattention.
export function useFocusMonitor(lessonId: string){
  const { token } = useAuth();
  const [active,setActive]=useState(false);
  const [sessionId,setSessionId]=useState<string|null>(null);
  const [negativeEvents,setNegativeEvents]=useState(0);
  const [terminated,setTerminated]=useState(false);
  const idleTimer = useRef<number|null>(null);

  const report = useCallback(async (event_type:string)=>{
    if(!token || !sessionId) return;
    try{
      const r = await api.sendEvents(token, sessionId, [{event_type}]);
      setNegativeEvents(r.negative_events);
      if(r.should_terminate){ setTerminated(true); }
    }catch{}
  },[token,sessionId]);

  const start = useCallback(async ()=>{
    if(!token) return;
    const s = await api.startSession(token, lessonId);
    setSessionId(s.id); setActive(true); setTerminated(false); setNegativeEvents(0);
  },[token,lessonId]);

  const stop = useCallback(async ()=>{
    if(token && sessionId){ try{ await api.endSession(token, sessionId, terminated?"terminated_violation":"completed"); }catch{} }
    setActive(false); setSessionId(null);
  },[token,sessionId,terminated]);

  // Tab visibility detection
  useEffect(()=>{
    if(!active) return;
    function onVis(){ if(document.hidden) report("tab_hidden"); else report("tab_returned"); }
    document.addEventListener("visibilitychange", onVis);
    return ()=>document.removeEventListener("visibilitychange", onVis);
  },[active,report]);

  // Inactivity detection: 30s with no keyboard/mouse -> inactivity event
  useEffect(()=>{
    if(!active) return;
    function resetIdle(){
      if(idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(()=>report("inactivity"), 30000);
    }
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    resetIdle();
    return ()=>{ window.removeEventListener("mousemove",resetIdle); window.removeEventListener("keydown",resetIdle); if(idleTimer.current) window.clearTimeout(idleTimer.current); };
  },[active,report]);

  return { active, start, stop, negativeEvents, terminated };
}
