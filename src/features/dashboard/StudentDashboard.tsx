import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Page, Container, PageHeader, Card, StatCard } from "../../app/ui";
import * as api from "../../lib/api";

function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}
function IconFlame() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.5-2-1-3 1 0 3 2 3 6a6 6 0 0 1-12 0c0-4 2-6 4-10Z" />
    </svg>
  );
}

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const [d, setD] = useState<{ enrolled_courses: number; total_points: number; current_streak: number } | null>(null);
  useEffect(() => {
    if (token) api.studentDashboard(token).then(setD).catch(() => {});
  }, [token]);

  return (
    <Page>
      <Container>
        <PageHeader eyebrow="Student" title={<>Welcome back, {user?.full_name?.split(" ")[0]}</>} subtitle="Here's where your learning stands today." />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Enrolled courses" value={d?.enrolled_courses ?? "–"} color="brand" icon={<IconBook />} />
          <StatCard label="Total points" value={d?.total_points ?? "–"} color="gold" icon={<IconStar />} />
          <StatCard label="Current streak" value={d?.current_streak ?? "–"} color="success" icon={<IconFlame />} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card to="/catalogue">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><IconBook /></span>
              <div>
                <div className="font-display font-semibold text-slate-800">Browse Courses</div>
                <div className="mt-0.5 text-sm text-slate-500">Enrol and start learning.</div>
              </div>
            </div>
          </Card>
          <Card to="/student/gamification">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600"><IconStar /></span>
              <div>
                <div className="font-display font-semibold text-slate-800">My Progress & Badges</div>
                <div className="mt-0.5 text-sm text-slate-500">Points, streak, leaderboard.</div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Page>
  );
}