import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Page, Container, PageHeader, Card, Button, EmptyState } from "../../app/ui";
import * as api from "../../lib/api";
import Conversation from "./Conversation";

export default function StudentMentors() {
  const { user, token } = useAuth();
  const [mentors, setMentors] = useState<{ mentorship_id: string; mentor_name: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (token) api.myMentors(token).then(setMentors).catch(() => {});
  }, [token]);

  return (
    <Page>
      <Container>
        <PageHeader eyebrow="Student" title="My Mentors" subtitle="Message the mentors guiding your learning." />

        {mentors.length === 0 && (
          <EmptyState>
            No mentor assigned yet. Ask your mentor to add you using your user ID:{" "}
            <span className="font-mono text-slate-500">{user?.id}</span>
          </EmptyState>
        )}
        <div className="space-y-3">
          {mentors.map((m) => (
            <Card key={m.mentorship_id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-100 text-sm font-semibold text-success-700">
                    {m.mentor_name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-800">{m.mentor_name}</span>
                </div>
                <Button variant="ghost" onClick={() => setActive(active === m.mentorship_id ? null : m.mentorship_id)} className="!py-1.5">
                  {active === m.mentorship_id ? "Close" : "Message"}
                </Button>
              </div>
              {active === m.mentorship_id && <Conversation mentorshipId={m.mentorship_id} />}
            </Card>
          ))}
        </div>
      </Container>
    </Page>
  );
}