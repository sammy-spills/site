import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/lib/data";
import Image from "next/image";

const starterSections = [
  "Replace the homepage copy with your own introduction.",
  "Add projects, writing, or services to the navigation pages.",
  "Update the site settings, social links, and SEO metadata.",
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        {site.profile.image ? (
          <div className="mx-auto relative size-32 overflow-hidden rounded-full border">
            <Image
              alt={site.profile.fullName || "Profile image"}
              className="object-cover"
              fill
              sizes="256px"
              src={site.profile.image}
            />
          </div>
        ) : (
          <Badge variant="secondary">Starter Template</Badge>
        )}
        <div className="space-y-3">
          <h1 className="font-bold text-3xl sm:text-4xl">
            {site.profile.fullName || "Your Name"}
          </h1>
          <p className="text-muted-foreground text-sm/relaxed">
            {site.profile.role} @{" "}
            <a
              href={site.profile.instituteUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
              >{site.profile.institute}</a>
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {starterSections.map((section) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle className="text-base">Next step</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm/relaxed">
                {section}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
