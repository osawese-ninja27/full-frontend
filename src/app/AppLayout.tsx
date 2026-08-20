import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          <div className="p-6 text-xl font-bold border-b border-slate-800 tracking-wide">
            SDLMS Platform
          </div>
          <nav className="mt-6 px-4 space-y-2">
            {user?.role === "mentor" ? (
              <>
                <Link
                  to="/mentor/dashboard"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/mentor/courses"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  My Courses
                </Link>
                <Link
                  to="/mentor/courses/new"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  Course Builder
                </Link>
                <Link
                  to="/mentor/students"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  My Students
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/student/dashboard"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/catalogue"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  Course Catalogue
                </Link>
                <Link
                  to="/student/mentors"
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  Find Mentors
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="truncate">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
export default AppLayout;