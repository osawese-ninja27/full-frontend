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
function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01" />
    </svg>
  );
}

export default function MentorDashboard() {
  const { user, token } = useAuth();
  const [d, setD] = useState<{ my_courses: number; mentee_count: number; low_focus_students: { student_name: string; negative_events: number }[] } | null>(null);
  useEffect(() => {
    if (token) api.mentorDashboard(token).then(setD).catch(() => {});
  }, [token]);

  return (
    <Page>
      <Container>
        <PageHeader eyebrow="Mentor" title={<>Welcome back, {user?.full_name?.split(" ")[0]}</>} subtitle="Here's how your mentees are doing." />

        {/* Low-focus alert first: this is the early-intervention signal mentors act on */}
        <Card className="mb-6 border-l-4 !border-l-alert-500">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-alert-50 text-alert-600"><IconAlert /></span>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-700">Low-focus students</h2>
          </div>
          {(!d || d.low_focus_students.length === 0) && (
            <p className="mt-3 text-sm text-slate-400">No focus concerns flagged right now.</p>
          )}
          <div className="mt-3 space-y-2">
            {d?.low_focus_students.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-alert-50/60 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{s.student_name}</span>
                <span className="font-semibold text-alert-600">{s.negative_events} events</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Courses" value={d?.my_courses ?? "–"} color="brand" icon={<IconBook />} />
          <StatCard label="Mentees" value={d?.mentee_count ?? "–"} color="success" icon={<IconUsers />} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card to="/mentor/courses">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><IconBook /></span>
              <div>
                <div className="font-display font-semibold text-slate-800">Manage Courses</div>
                <div className="mt-0.5 text-sm text-slate-500">Build modules, lessons, quizzes.</div>
              </div>
            </div>
          </Card>
          <Card to="/mentor/students">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600"><IconUsers /></span>
              <div>
                <div className="font-display font-semibold text-slate-800">My Students</div>
                <div className="mt-0.5 text-sm text-slate-500">Assign and message mentees.</div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Page>
  );
}