import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Page, Container, PageHeader, Card, Badge, Button, Input, Textarea, EmptyState } from "../../app/ui";
import * as api from "../../lib/api";
import type { Course } from "../../types";

export default function MentorCourses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  async function refresh() {
    if (token) setCourses(await api.listMyCourses(token));
  }
  useEffect(() => {
    refresh();
  }, [token]);

  async function create() {
    if (!token || !title) return;
    await api.createCourse(token, { title, description: desc });
    setTitle("");
    setDesc("");
    refresh();
  }
  async function toggle(c: Course) {
    if (!token) return;
    c.is_published ? await api.unpublishCourse(token, c.id) : await api.publishCourse(token, c.id);
    refresh();
  }
  async function del(id: string) {
    if (!token || !confirm("Delete this course?")) return;
    await api.deleteCourse(token, id);
    refresh();
  }

  return (
    <Page>
      <Container>
        <PageHeader eyebrow="Mentor" title="My Courses" subtitle="Create, publish, and manage your course library." />

        <Card className="mb-6">
          <h2 className="font-display text-base font-semibold text-slate-800">Create a course</h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
            <Button onClick={create}>Create course</Button>
          </div>
        </Card>

        <div className="space-y-3">
          {courses.length === 0 && <EmptyState>No courses yet. Create your first one above.</EmptyState>}
          {courses.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-slate-800">{c.title}</span>
                  <Badge color={c.is_published ? "green" : "amber"}>{c.is_published ? "Published" : "Draft"}</Badge>
                </div>
                {c.description && <p className="mt-1 text-sm text-slate-500">{c.description}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link to={`/mentor/courses/${c.id}`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">
                  Build
                </Link>
                <Button variant="secondary" onClick={() => toggle(c)} className="!py-1.5">
                  {c.is_published ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="danger" onClick={() => del(c.id)} className="!py-1.5">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Page>
  );
}