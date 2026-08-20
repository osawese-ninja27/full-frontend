import type { User, Course, Module, Lesson, ModuleProgress, Gamification, Assessment } from "../types";
const BASE = import.meta.env.VITE_API_BASE_URL as string;
export class ApiError extends Error { status:number; constructor(s:number,m:string){super(m);this.status=s;} }
interface Opt { method?:string; body?:unknown; token?:string; }
export async function req<T>(path:string, o:Opt={}):Promise<T>{
  const { method="GET", body, token } = o;
  const headers:Record<string,string> = { "Content-Type":"application/json" };
  if (token) headers["Authorization"]=`Bearer ${token}`;
  let res:Response;
  try { res = await fetch(`${BASE}${path}`, { method, headers, body: body?JSON.stringify(body):undefined }); }
  catch { throw new ApiError(0,"Cannot reach the server. Is the backend running?"); }
  if (!res.ok){
    let d="Something went wrong";
    try{
      const j=await res.json();
      if(typeof j.detail==="string") d=j.detail;
      else if(Array.isArray(j.detail)) d=j.detail.map((item: { msg?: string })=>item.msg).filter(Boolean).join("; ");
    }catch{}
    throw new ApiError(res.status,d);
  }
  if (res.status===204) return undefined as T;
  return res.json() as Promise<T>;
}
// auth
export const login=(email:string,password:string)=>req<{access_token:string}>("/auth/login",{method:"POST",body:{email,password}});
export const register=(b:{email:string;password:string;full_name:string;role:string})=>req<User>("/auth/register",{method:"POST",body:b});
export const getMe=(token:string)=>req<User>("/auth/me",{token});
// courses
export const listMyCourses=(t:string)=>req<Course[]>("/courses/mine",{token:t});
export const listCatalogue=(t:string)=>req<Course[]>("/courses",{token:t});
export const createCourse=(t:string,b:{title:string;description?:string})=>req<Course>("/courses",{method:"POST",body:b,token:t});
export const publishCourse=(t:string,id:string)=>req<Course>(`/courses/${id}/publish`,{method:"POST",token:t});
export const unpublishCourse=(t:string,id:string)=>req<Course>(`/courses/${id}/unpublish`,{method:"POST",token:t});
export const deleteCourse=(t:string,id:string)=>req<void>(`/courses/${id}`,{method:"DELETE",token:t});
// content
export const listModules=(t:string,cid:string)=>req<Module[]>(`/courses/${cid}/modules`,{token:t});
export const createModule=(t:string,cid:string,b:{title:string;min_pass_score?:number})=>req<Module>(`/courses/${cid}/modules`,{method:"POST",body:b,token:t});
export const listLessons=(t:string,mid:string)=>req<Lesson[]>(`/modules/${mid}/lessons`,{token:t});
export const createLesson=(t:string,mid:string,b:{title:string;content?:string})=>req<Lesson>(`/modules/${mid}/lessons`,{method:"POST",body:b,token:t});
export const addQuestion=(t:string,mid:string,b:{prompt:string;options:{text:string;is_correct:boolean}[]})=>req(`/modules/${mid}/questions`,{method:"POST",body:b,token:t});
// learning
export const enroll=(t:string,cid:string)=>req(`/courses/${cid}/enroll`,{method:"POST",token:t});
export const getProgress=(t:string,cid:string)=>req<ModuleProgress[]>(`/courses/${cid}/progress`,{token:t});
export const getAssessment=(t:string,mid:string)=>req<Assessment>(`/modules/${mid}/assessment`,{token:t});
export const submitAssessment=(t:string,mid:string,answers:Record<string,string>)=>req<{score:number;passed:boolean}>(`/modules/${mid}/assessment/submit`,{method:"POST",body:{answers},token:t});
// monitoring
export const startSession=(t:string,lesson_id:string)=>req<{id:string}>("/sessions/start",{method:"POST",body:{lesson_id},token:t});
export const sendEvents=(t:string,sid:string,events:{event_type:string}[])=>req<{negative_events:number;should_terminate:boolean}>(`/sessions/${sid}/events`,{method:"POST",body:{events},token:t});
export const endSession=(t:string,sid:string,reason:string)=>req(`/sessions/${sid}/end`,{method:"POST",body:{reason},token:t});
// gamification
export const getGamification=(t:string)=>req<Gamification>("/me/gamification",{token:t});
export const getLeaderboard=(t:string)=>req<{full_name:string;points:number}[]>("/leaderboard",{token:t});
// mentorship
export const myStudents=(t:string)=>req<{mentorship_id:string;student_name:string;student_email:string;student_id:string}[]>("/mentor/students",{token:t});
export const myMentors=(t:string)=>req<{mentorship_id:string;mentor_name:string}[]>("/my/mentors",{token:t});
export const getMessages=(t:string,mid:string)=>req<{id:string;sender_id:string;body:string;sent_at:string}[]>(`/mentorships/${mid}/messages`,{token:t});
export const sendMessage=(t:string,mid:string,body:string)=>req(`/mentorships/${mid}/messages`,{method:"POST",body:{body},token:t});
// dashboards
export const studentDashboard=(t:string)=>req<{enrolled_courses:number;total_points:number;current_streak:number;badges:unknown[]}>("/student/dashboard",{token:t});
export const mentorDashboard=(t:string)=>req<{my_courses:number;mentee_count:number;low_focus_students:{student_name:string;negative_events:number}[]}>("/mentor/dashboard",{token:t});
