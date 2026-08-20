import { createContext, useContext, useState, type ReactNode } from "react";
import * as api from "../../lib/api";
import type { User } from "../../types";
interface Ctx { user:User|null; token:string|null; login:(e:string,p:string)=>Promise<User>; register:(b:{email:string;password:string;full_name:string;role:string})=>Promise<void>; logout:()=>void; }
const AuthContext = createContext<Ctx|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){
  const [token,setToken]=useState<string|null>(null);
  const [user,setUser]=useState<User|null>(null);
  async function login(email:string,password:string){ const t=await api.login(email,password); const me=await api.getMe(t.access_token); setToken(t.access_token); setUser(me); return me; }
  async function register(b:{email:string;password:string;full_name:string;role:string}){ await api.register(b); }
  function logout(){ setToken(null); setUser(null); }
  return <AuthContext.Provider value={{user,token,login,register,logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){ const c=useContext(AuthContext); if(!c) throw new Error("useAuth outside provider"); return c; }
