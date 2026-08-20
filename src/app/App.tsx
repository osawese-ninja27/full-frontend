import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import MentorDashboard from "../features/dashboard/MentorDashboard";
import StudentDashboard from "../features/dashboard/StudentDashboard";
import MentorCourses from "../features/courses/MentorCourses";
import CourseBuilder from "../features/courses/CourseBuilder";
import MentorStudents from "../features/mentorship/MentorStudents";
import StudentMentors from "../features/mentorship/StudentMentors";
import Catalogue from "../features/learning/Catalogue";
import CourseView from "../features/learning/CourseView";
import GamificationPage from "../features/learning/Gamification";
import AdminDashboard from "../features/dashboard/AdminDashboard";

export default function App() {
  return (
    <Routes>
      {/* Public Pages (No Sidebar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Application (Wrapped in AppLayout so the Sidebar shows) */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/mentor/dashboard" element={<ProtectedRoute allowedRoles={["mentor"]}><MentorDashboard /></ProtectedRoute>} />
        <Route path="/mentor/courses" element={<ProtectedRoute allowedRoles={["mentor"]}><MentorCourses /></ProtectedRoute>} />
        <Route path="/mentor/courses/new" element={<ProtectedRoute allowedRoles={["mentor"]}><CourseBuilder /></ProtectedRoute>} />
        <Route path="/mentor/courses/:courseId" element={<ProtectedRoute allowedRoles={["mentor"]}><CourseBuilder /></ProtectedRoute>} />
        <Route path="/mentor/students" element={<ProtectedRoute allowedRoles={["mentor"]}><MentorStudents /></ProtectedRoute>} />

        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/mentors" element={<ProtectedRoute allowedRoles={["student"]}><StudentMentors /></ProtectedRoute>} />
        <Route path="/catalogue" element={<ProtectedRoute allowedRoles={["student"]}><Catalogue /></ProtectedRoute>} />
        <Route path="/student/courses/:courseId" element={<ProtectedRoute allowedRoles={["student"]}><CourseView /></ProtectedRoute>} />
        <Route path="/student/gamification" element={<ProtectedRoute allowedRoles={["student"]}><GamificationPage /></ProtectedRoute>} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}