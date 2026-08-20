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

export default function App() {
  return (
    <Routes>
      {/* Public Pages (No Sidebar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Application (Wrapped in AppLayout so the Sidebar shows) */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/mentor/courses" element={<MentorCourses />} />
        <Route path="/mentor/courses/new" element={<CourseBuilder />} />
        <Route path="/mentor/students" element={<MentorStudents />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/mentors" element={<StudentMentors />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/student/courses/:courseId" element={<CourseView />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}