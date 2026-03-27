import { PublicationsTabs } from "@/components/publications-tabs";
import { publications } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description: "Add publications, articles, or resources here.",
};

export default function PublicationsPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-2 font-bold text-3xl">Publications</h1>
        <p className="text-muted-foreground text-sm/relaxed">
          A selection of my published work and research.
        </p>
      </section>

      {publications.length > 0 ? (
        <section>
          <PublicationsTabs publications={publications} />
        </section>
      ) : (
        <section>
          <p className="text-muted-foreground text-sm/relaxed">
            No publications have been added yet.
          </p>
        </section>
      )}
    </div>
  );
}
