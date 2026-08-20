import { Page, Container, PageHeader } from "../../app/ui";

export default function CourseBuilder() {
  // ... keep your existing state and handlers here ...

  return (
    <Page>
      <Container wide>
        <PageHeader eyebrow="Mentor" title="Course Builder" subtitle="Create, structure, and publish new course modules." />

        {/* Expanded Main Form Box */}
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-[var(--shadow-card)] min-h-[60vh]">
          {/* Place your existing course form fields, module inputs, and save buttons here */}
        </div>
      </Container>
    </Page>
  );
}