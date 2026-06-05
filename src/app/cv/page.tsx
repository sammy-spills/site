import {
  ArrowUpRight,
  BriefcaseIcon,
  Code2Icon,
  GraduationCapIcon,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { education, experiences, skills } from "@/lib/data";

export const metadata: Metadata = {
  title: "CV",
  description: "Add your experience, education, and skills here.",
};

export default function CVPage() {
  const hasContent =
    experiences.length > 0 || education.length > 0 || skills.length > 0;

  return (
    <main className="mistral-prototype -mx-6 -mt-10 md:-mx-10 lg:-mx-16">
      <section className="border-border border-b">
        <div className="grid lg:grid-cols-[384px_1fr] xl:grid-cols-[480px_1fr]">
          <div className="border-border border-r px-6 py-14 md:px-10 lg:px-14">
            <p className="font-mono text-muted-foreground text-xs uppercase">
              Curriculum Vitae
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-6xl leading-none md:text-8xl">
              CV.
            </h1>
          </div>
          <div className="flex flex-col justify-between px-6 py-14 md:px-10 lg:px-14">
            <p className="max-w-3xl text-muted-foreground text-xl leading-8">
              AI/ML research engineering, national security delivery, applied
              cyber research, and production-grade model systems.
            </p>
          </div>
        </div>
      </section>

      {!hasContent ? (
        <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-14">
          <p className="text-muted-foreground text-sm/relaxed">
            No CV content has been added yet.
          </p>
        </section>
      ) : null}

      {experiences.length > 0 ? (
        <section className="border-border border-b bg-background">
          <SectionHeader
            count={experiences.length}
            icon={BriefcaseIcon}
            label=""
            title="Experience"
          />
          <div className="mx-auto max-w-7xl border-border border-t">
            {experiences.map((experience, index) => (
              <article
                className="grid gap-6 border-border border-b px-6 py-8 last:border-b-0 md:grid-cols-[88px_1fr] md:px-10 lg:grid-cols-[96px_1fr_240px] lg:px-14"
                key={`${experience.company}-${experience.title}-${experience.time}`}
              >
                <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2 className="font-sans font-semibold text-2xl leading-tight">
                    {experience.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {experience.company}
                    {experience.location ? ` / ${experience.location}` : ""}
                  </p>
                  {experience.description ? (
                    <p className="mt-5 max-w-3xl text-muted-foreground text-sm leading-7">
                      {experience.description}
                    </p>
                  ) : null}
                </div>
                <p className="font-mono text-[0.72rem] text-muted-foreground uppercase lg:text-right">
                  {experience.time}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="border-border border-b bg-[#fff8e0] text-[#1f1f1f]">
          <SectionHeader
            count={education.length}
            icon={GraduationCapIcon}
            label=""
            title="Education"
          />
          <div className="mx-auto max-w-7xl border-[#1f1f1f]/20 border-t">
            {education.map((item, index) => (
              <article
                className="grid gap-6 border-[#1f1f1f]/20 border-b px-6 py-8 last:border-b-0 md:grid-cols-[88px_1fr] md:px-10 lg:grid-cols-[96px_1fr_220px] lg:px-14"
                key={`${item.school}-${item.degree}-${item.time}`}
              >
                <p className="font-mono text-[0.7rem] text-[#1f1f1f]/55 uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2 className="font-sans font-semibold text-2xl leading-tight">
                    {item.degree}
                  </h2>
                  <p className="mt-2 text-[#1f1f1f]/65 text-sm">
                    {item.school}
                    {item.location ? ` / ${item.location}` : ""}
                  </p>
                  {item.description ? (
                    <p className="mt-5 max-w-3xl text-[#1f1f1f]/70 text-sm leading-7">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <p className="font-mono text-[0.72rem] text-[#1f1f1f]/55 uppercase lg:text-right">
                  {item.time}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section className="bg-background">
          <SectionHeader
            count={skills.length}
            icon={Code2Icon}
            label=""
            title="Skills"
          />
          <div className="mx-auto grid max-w-7xl border-border border-t md:grid-cols-3">
            {skills.map((skill, index) => (
              <article
                className="border-border border-b px-6 py-8 md:border-r md:px-10 md:last:border-r-0 lg:px-14"
                key={skill.title}
              >
                <p className="font-mono text-[0.7rem] text-primary uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 font-sans font-semibold text-xl">
                  {skill.title}
                </h2>
                <p className="mt-3 text-muted-foreground text-sm leading-7">
                  {skill.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function SectionHeader({
  count,
  icon: Icon,
  label,
  title,
}: {
  count: number;
  icon: LucideIcon;
  label: string;
  title: string;
}) {
  return (
    <div className="mx-auto grid max-w-7xl border-border border-t lg:grid-cols-[0.78fr_1.22fr]">
      <div className="flex items-center gap-3 border-border border-r px-6 py-8 md:px-10 lg:px-14">
        <div className="flex size-10 items-center justify-center border border-foreground/30">
          <Icon className="size-4 text-primary" aria-hidden="true" />
        </div>
        <div>
          <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
            {label}
          </p>
          <h2 className="mt-1 font-sans font-semibold text-2xl">{title}</h2>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-6 py-8 md:px-10 lg:px-14">
        <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
          {count} entries
        </p>
        <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
      </div>
    </div>
  );
}
