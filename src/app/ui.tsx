import { useAuth } from "../features/auth/AuthContext";
import { Link } from "react-router-dom";
export function TopBar({title,links}:{title:string;links?:{to:string;label:string}[]}){
  const { logout } = useAuth();
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      <div className="flex items-center gap-3">
        {links?.map(l=><Link key={l.to} to={l.to} className="text-sm text-blue-600 hover:underline">{l.label}</Link>)}
        <button onClick={logout} className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-300">Log out</button>
      </div>
    </header>
  );
}
export function Badge({children,color="slate"}:{children:React.ReactNode;color?:string}){
  const map:Record<string,string>={green:"bg-green-100 text-green-700",amber:"bg-amber-100 text-amber-700",slate:"bg-slate-100 text-slate-600",blue:"bg-blue-100 text-blue-700",red:"bg-red-100 text-red-700"};
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[color]}`}>{children}</span>;
}
