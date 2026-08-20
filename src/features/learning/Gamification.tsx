import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Page, Container, PageHeader, Card, StatCard } from "../../app/ui";
import * as api from "../../lib/api";
import type { Gamification } from "../../types";

export default function GamificationPage() {
  const { token } = useAuth();
  const [g, setG] = useState<Gamification | null>(null);
  const [lb, setLb] = useState<{ full_name: string; points: number }[]>([]);
  useEffect(() => {
    if (token) {
      api.getGamification(token).then(setG).catch(() => {});
      api.getLeaderboard(token).then(setLb).catch(() => {});
    }
  }, [token]);

  return (
    <Page>
      <Container>
        <PageHeader eyebrow="Student" title="My Progress" subtitle="Points, streaks, badges, and where you rank." />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total points" value={g?.total_points ?? 0} color="gold" />
          <StatCard label="Current streak" value={`🔥 ${g?.current_streak ?? 0}`} color="success" />
          <StatCard label="Longest streak" value={g?.longest_streak ?? 0} color="brand" />
        </div>

        <Card className="mt-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-500">Badges</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(!g || g.badges.length === 0) && <p className="text-sm text-slate-400">No badges yet. Pass a module quiz to earn one.</p>}
            {g?.badges.map((b) => (
              <span key={b.code} className="rounded-lg bg-gold-50 px-3 py-2 text-sm">
                <span className="font-semibold text-gold-700">🏅 {b.name}</span>
                <span className="ml-1 text-gold-600">— {b.description}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card className="mt-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-500">Leaderboard</h2>
          <div className="mt-3 space-y-1">
            {lb.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm even:bg-slate-50">
                <span className="text-slate-700">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">{i + 1}</span>
                  {r.full_name}
                </span>
                <span className="font-semibold text-slate-800">{r.points} pts</span>
              </div>
            ))}
            {lb.length === 0 && <p className="text-sm text-slate-400">No ranked students yet.</p>}
          </div>
        </Card>
      </Container>
    </Page>
  );
}