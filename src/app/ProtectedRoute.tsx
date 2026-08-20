import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { UserRole } from "../types";
import type { ReactNode } from "react";
export default function ProtectedRoute({children,allowedRoles}:{children:ReactNode;allowedRoles?:UserRole[]}){
  const { user } = useAuth();
  if(!user) return <Navigate to="/login" replace/>;
  if(allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={user.role==="mentor"?"/mentor":"/student"} replace/>;
  return <>{children}</>;
}
