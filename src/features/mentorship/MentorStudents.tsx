import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Page, Container, PageHeader, Card, Button, Input, EmptyState } from "../../app/ui";
import * as api from "../../lib/api";
import Conversation from "./Conversation";

export default function MentorStudents() {
  const { token } = useAuth();
  const [students, setStudents] = useState<{ mentorship_id: string; student_name: string; student_email: string; student_id: string }[]>([]);
  const [sid, setSid] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    if (token) setStudents(await api.myStudents(token));
  }
  useEffect(() => {
    refresh();
  }, [token]);

  async function assign() {
    if (!token || !sid) return;
    try {
      await api.req("/mentor/students", { method: "POST", body: { student_id: sid }, token });
      setSid("");
      setErr(null);
      refresh();
    } catch (x) {
      setErr((x as Error).message);
    }
  }

  return (
    <Page>
      <Container>
        <PageHeader eyebrow="Mentor" title="My Students" subtitle="Manage mentees and check in with them." />

        <Card className="mb-6">
          <h2 className="font-display text-base font-semibold text-slate-800">Assign a student</h2>
          <p className="mt-1 text-xs text-slate-400">Paste the student's user ID (from their profile) to add them as a mentee.</p>
          <div className="mt-3 flex gap-2">
            <Input placeholder="Student user ID (UUID)" value={sid} onChange={(e) => setSid(e.target.value)} className="flex-1" />
            <Button onClick={assign} className="shrink-0">
              Assign
            </Button>
          </div>
          {err && <p className="mt-2 text-sm font-medium text-alert-600">{err}</p>}
        </Card>

        <div className="space-y-2">
          {students.length === 0 && <EmptyState>No mentees yet. Assign a student above to get started.</EmptyState>}
          {students.map((s) => (
            <Card key={s.mentorship_id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                    {s.student_name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{s.student_name}</div>
                    <div className="text-sm text-slate-500">{s.student_email}</div>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setActive(active === s.mentorship_id ? null : s.mentorship_id)} className="!py-1.5">
                  {active === s.mentorship_id ? "Close" : "Message"}
                </Button>
              </div>
              {active === s.mentorship_id && <Conversation mentorshipId={s.mentorship_id} />}
            </Card>
          ))}
        </div>
      </Container>
    </Page>
  );
}