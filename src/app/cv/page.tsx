import { BriefcaseIcon, Code2Icon, GraduationCapIcon } from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { education, experiences, skills } from "@/lib/data";

export const metadata: Metadata = {
  title: "CV",
  description: "Add your experience, education, and skills here.",
};

export default function CVPage() {
  const hasContent =
    experiences.length > 0 || education.length > 0 || skills.length > 0;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">Curriculum Vitae</h1>
      </section>

      {!hasContent ? (
        <section>
          <p className="text-muted-foreground text-sm/relaxed">
            No CV content has been added yet.
          </p>
        </section>
      ) : null}

      {experiences.length > 0 ? (
        <section className="space-y-4">
          <div className="mb-4 flex items-center gap-2">
            <BriefcaseIcon className="size-5 text-muted-foreground" />
            <h2 className="font-semibold text-2xl">Experience</h2>
          </div>
          <div className="space-y-4">
            {experiences.map((experience) => (
              <Card
                key={`${experience.company}-${experience.title}-${experience.time}`}
              >
                <CardHeader className="gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="space-y-1">
                    <CardTitle>{experience.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {experience.company}
                      {experience.location ? ` • ${experience.location}` : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {experience.time}
                  </Badge>
                </CardHeader>
                {experience.description ? (
                  <CardContent>
                    <p className="text-muted-foreground text-sm/relaxed">
                      {experience.description}
                    </p>
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {education.length > 0 ? (
        <section className="space-y-4">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCapIcon className="size-5 text-muted-foreground" />
            <h2 className="font-semibold text-2xl">Education</h2>
          </div>
          <div className="space-y-4">
            {education.map((item) => (
              <Card key={`${item.school}-${item.degree}-${item.time}`}>
                <CardHeader className="gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="space-y-1">
                    <CardTitle>{item.degree}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {item.school}
                      {item.location ? ` • ${item.location}` : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {item.time}
                  </Badge>
                </CardHeader>
                {item.description ? (
                  <CardContent>
                    <p className="text-muted-foreground text-sm/relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section className="space-y-4">
          <div className="mb-4 flex items-center gap-2">
            <Code2Icon className="size-5 text-muted-foreground" />
            <h2 className="font-semibold text-2xl">Skills</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {skills.map((skill) => (
              <Card key={skill.title} size="sm">
                <CardHeader>
                  <CardTitle className="text-bold">{skill.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm/relaxed">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
