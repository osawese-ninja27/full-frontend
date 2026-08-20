import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Page, Container, PageHeader, Card, Button, EmptyState } from "../../app/ui";
import * as api from "../../lib/api";
import type { Course } from "../../types";

export default function Catalogue() {
  const { token } = useAuth();
  const nav = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    if (token) api.listCatalogue(token).then(setCourses).catch(() => {});
  }, [token]);

  async function open(c: Course) {
    if (!token) return;
    try {
      await api.enroll(token, c.id);
    } catch {
      /* already enrolled */
    }
    nav(`/student/courses/${c.id}`);
  }

  return (
    <Page>
      <Container wide>
        <PageHeader eyebrow="Student" title="Course Catalogue" subtitle="Discover courses published by your mentors." />

        {courses.length === 0 && <EmptyState>No published courses yet. Check back soon.</EmptyState>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id}>
              <div className="flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-2xl font-bold text-white">
                {c.title.slice(0, 1).toUpperCase()}
              </div>
              <h3 className="mt-3 font-display font-semibold text-slate-800">{c.title}</h3>
              {c.description && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{c.description}</p>}
              <Button onClick={() => open(c)} className="mt-4 w-full">
                Enrol & open
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </Page>
  );
}