import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Page, Container, PageHeader, Card, Button, Input, Textarea, Badge } from "../../app/ui";
import * as api from "../../lib/api";
import type { Module, Lesson } from "../../types";

export default function CourseBuilder() {
  const { courseId } = useParams();
  const { token } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [mTitle, setMTitle] = useState("");
  const [score, setScore] = useState(70);

  async function refresh() {
    if (token && courseId) setModules(await api.listModules(token, courseId));
  }
  useEffect(() => {
    refresh();
  }, [token, courseId]);

  async function addModule() {
    if (!token || !courseId || !mTitle) return;
    await api.createModule(token, courseId, { title: mTitle, min_pass_score: score });
    setMTitle("");
    refresh();
  }

  return (
    <Page>
      <Container wide>
        <PageHeader eyebrow="Mentor" title="Course Builder" subtitle="Create, structure, and publish new course modules." />

        <Card className="mb-6">
          <h2 className="font-display text-base font-semibold text-slate-800">Add a module</h2>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input placeholder="Module title" value={mTitle} onChange={(e) => setMTitle(e.target.value)} className="flex-1" />
            <Input
              type="number"
              min={0}
              max={100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              title="Pass score %"
              className="sm:w-24"
            />
            <Button onClick={addModule} className="shrink-0">Add</Button>
          </div>
          <p className="mt-2 text-xs text-slate-400">Pass score = minimum quiz % a student needs to unlock the next module.</p>
        </Card>

        <div className="space-y-4">
          {modules.map((m, i) => (
            <ModuleEditor key={m.id} module={m} index={i} />
          ))}
        </div>
      </Container>
    </Page>
  );
}

function ModuleEditor({ module, index }: { module: Module; index: number }) {
  const { token } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lt, setLt] = useState("");
  const [lc, setLc] = useState("");
  const [open, setOpen] = useState(false);

  // Quiz question builder — supports more than 2 options.
  const [qp, setQp] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);

  async function refresh() {
    if (token) setLessons(await api.listLessons(token, module.id));
  }
  useEffect(() => {
    if (open) refresh();
  }, [open, token]);

  async function addLesson() {
    if (!token || !lt) return;
    await api.createLesson(token, module.id, { title: lt, content: lc });
    setLt("");
    setLc("");
    refresh();
  }

  function setOption(i: number, value: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));
  }
  function addOptionField() {
    setOptions((prev) => [...prev, ""]);
  }
  function removeOptionField(i: number) {
    if (options.length <= 2) return; // keep at least 2 options
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    if (correct === i) setCorrect(0);
    else if (correct > i) setCorrect((c) => c - 1);
  }

  async function addQ() {
    const filled = options
      .map((text, i) => ({ text, i }))
      .filter((o) => o.text.trim() !== "");
    if (!token || !qp || filled.length < 2) return;
    await api.addQuestion(token, module.id, {
      prompt: qp,
      options: filled.map(({ text, i }) => ({ text, is_correct: i === correct })),
    });
    setQp("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
    alert("Question added");
  }

  return (
    <Card>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <span className="font-display font-semibold text-slate-800">
          Module {index + 1}: {module.title}{" "}
          <Badge color="blue">pass {module.min_pass_score}%</Badge>
        </span>
        <span className="text-slate-400">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="mt-5 space-y-6 border-t border-slate-100 pt-5">
          {/* Lessons */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-500">Lessons</h3>
            <div className="mt-2 space-y-1">
              {lessons.map((l) => (
                <div key={l.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {l.title}
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <Input placeholder="Lesson title" value={lt} onChange={(e) => setLt(e.target.value)} />
              <Textarea
                placeholder="Content"
                value={lc}
                onChange={(e) => setLc(e.target.value)}
                rows={8}
                className="min-h-[220px] resize-y"
              />
              <Button onClick={addLesson} variant="secondary">
                Add lesson
              </Button>
            </div>
          </div>

          {/* Quiz question builder */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-500">Add a quiz question</h3>
            <Input placeholder="Question" value={qp} onChange={(e) => setQp(e.target.value)} className="mt-3" />

            <div className="mt-3 space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={correct === i}
                    onChange={() => setCorrect(i)}
                    className="h-4 w-4 accent-brand-600"
                    title="Mark as correct answer"
                  />
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChange={(e) => setOption(i, e.target.value)}
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOptionField(i)}
                      className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-alert-50 hover:text-alert-600"
                      title="Remove option"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addOptionField}
              className="mt-2 text-sm font-medium text-brand-600 hover:underline"
            >
              + Add another option
            </button>

            <p className="mt-2 text-xs text-slate-400">Select the radio next to the correct option.</p>
            <Button onClick={addQ} className="mt-3">
              Add question
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
