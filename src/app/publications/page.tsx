import { PublicationsTabs } from "@/components/publications-tabs";
import { publications } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description: "Add publications, articles, or resources here.",
};

export default function PublicationsPage() {
  return (
    <main className="mistral-prototype -mx-6 -mt-10 md:-mx-10 lg:-mx-16">
      <section className="border-border border-b">
        <div className="grid md:grid-cols-[480px_1fr] 2xl:grid-cols-[576px_1fr]">
          <div className="border-border border-r px-6 py-14 md:px-10 lg:px-14">
            <p className="font-mono text-muted-foreground text-xs uppercase">
              Research index
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-6xl leading-none md:text-7xl 2xl:text-8xl">
              Publications.
            </h1>
          </div>
          <div className="flex flex-col justify-between py-14 lg:grid lg:grid-rows-[240px_96px] lg:py-0">
            <p className="max-w-3xl px-6 text-muted-foreground text-xl leading-8 md:px-12 lg:py-14">
              Published work, preprints, workshops, and public research notes
              across AI, cyber security, and applied machine learning.
            </p>
            <div className="mt-10 ml-12 grid w-[calc(100%-3rem)] border border-border md:w-96 md:grid-cols-2 lg:mt-0 lg:h-24">
              <div className="flex flex-col justify-center border-border border-b px-5 md:border-r md:border-b-0">
                <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
                  Total records
                </p>
                <p className="mt-2 font-semibold text-sm">
                  {publications.length} publications
                </p>
              </div>
              <div className="flex flex-col justify-center px-5">
                <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
                  Latest
                </p>
                <p className="mt-2 font-semibold text-sm">
                  {publications[0]?.date ?? "No records"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {publications.length > 0 ? (
        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-14">
            <PublicationsTabs publications={publications} />
          </div>
        </section>
      ) : (
        <section className="bg-background">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-14 md:px-10 lg:px-14">
            <p className="text-muted-foreground text-sm/relaxed">
              No publications have been added yet.
            </p>
            <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
          </div>
        </section>
      )}
    </main>
  );
}
