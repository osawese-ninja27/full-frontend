import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { UserRole } from "../types";
import type { ReactNode } from "react";
export default function ProtectedRoute({children,allowedRoles}:{children:ReactNode;allowedRoles?:UserRole[]}){
  const { user } = useAuth();
  if(!user) return <Navigate to="/login" replace/>;
  if(allowedRoles && !allowedRoles.includes(user.role)) {
    const home = user.role === "admin" ? "/admin" : user.role === "mentor" ? "/mentor/dashboard" : "/student/dashboard";
    return <Navigate to={home} replace/>;
  }
  return <>{children}</>;
}
