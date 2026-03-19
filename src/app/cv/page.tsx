import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description: "Add your experience, education, and skills here.",
};

export default function CVPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">CV</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          No CV content has been added yet.
        </p>
      </section>
    </div>
  );
}
