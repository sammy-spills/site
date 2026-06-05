"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Publication } from "@/lib/schemas/content";

const TAB_ORDER = [
  "Journal Article",
  "Conference Paper",
  "Workshop",
  "Book Chapter",
  "Edited Book",
  "Report",
  "Preprint",
  "Web Article",
] as const;

function pluralizeType(type: string) {
  return type === "Journal Article" ? "Journal Articles" : `${type}s`;
}

function PublicationRow({ index, pub }: { index: number; pub: Publication }) {
  return (
    <article className="grid gap-5 border-border border-b px-0 py-7 last:border-b-0 md:grid-cols-[72px_1fr] lg:grid-cols-[88px_1fr_190px]">
      <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
        {String(index + 1).padStart(2, "0")}
      </p>
      <div>
        <h2 className="max-w-3xl font-sans font-semibold text-2xl leading-tight">
          {pub.title}
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground text-sm leading-6">
          {pub.authors}
        </p>
        {pub.editors ? (
          <p className="mt-2 max-w-3xl text-muted-foreground text-sm leading-6">
            Edited by {pub.editors}
          </p>
        ) : null}
        {pub.abstract ? (
          <div className="mt-5 max-w-3xl">
            <p className="font-mono text-[0.68rem] text-primary uppercase">
              Abstract
            </p>
            <p className="mt-2 text-muted-foreground text-sm leading-7">
              {pub.abstract}
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 lg:items-end lg:text-right">
        <p className="font-mono text-[0.7rem] text-primary uppercase">
          {pub.type}
        </p>
        <p className="text-muted-foreground text-sm">
          {pub.venue}
          {pub.venue && pub.date ? " / " : ""}
          {pub.date}
        </p>
        {pub.link ? (
          <Link
            className="inline-flex h-9 w-fit items-center gap-2 border border-foreground/25 px-3 font-medium text-foreground text-xs no-underline transition-colors hover:bg-foreground hover:text-background"
            href={pub.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            View
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function PublicationsTabs({
  publications,
}: {
  publications: Publication[];
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Publication[]>();
    for (const pub of publications) {
      const existing = map.get(pub.type);
      if (existing) {
        existing.push(pub);
      } else {
        map.set(pub.type, [pub]);
      }
    }
    return map;
  }, [publications]);

  const tabs = useMemo(() => {
    return TAB_ORDER.filter((type) => grouped.has(type));
  }, [grouped]);

  return (
    <Tabs className="gap-0" defaultValue="all">
      <div className="grid border-border border-y lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-border border-r px-0 py-4 lg:px-0">
          <p className="px-0 font-mono text-[0.7rem] text-muted-foreground uppercase">
            Filter
          </p>
        </div>
        <TabsList className="!h-auto flex w-full flex-wrap justify-start gap-0 rounded-none bg-transparent p-0">
          <TabsTrigger
            className="h-11 flex-none rounded-none border-border border-r px-4 font-mono text-[0.68rem] uppercase data-active:bg-foreground data-active:text-background"
            value="all"
          >
            All ({publications.length})
          </TabsTrigger>
          {tabs.map((type) => (
            <TabsTrigger
              className="h-11 flex-none rounded-none border-border border-r px-4 font-mono text-[0.68rem] uppercase data-active:bg-foreground data-active:text-background"
              key={type}
              value={type}
            >
              {pluralizeType(type)} ({grouped.get(type)?.length})
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent className="mt-0" value="all">
        <div className="border-border border-b">
          {publications.map((pub, index) => (
            <PublicationRow
              index={index}
              key={`${pub.title}-${pub.type}-${index}`}
              pub={pub}
            />
          ))}
        </div>
      </TabsContent>

      {tabs.map((type) => (
        <TabsContent className="mt-0" key={type} value={type}>
          <div className="border-border border-b">
            {grouped.get(type)?.map((pub, index) => (
              <PublicationRow
                index={index}
                key={`${pub.title}-${pub.type}-${index}`}
                pub={pub}
              />
            ))}
          </div>
        </TabsContent>
      ))}

      <div className="flex items-center justify-between border-border border-b py-5">
        <p className="font-mono text-[0.7rem] text-muted-foreground uppercase">
          End of index
        </p>
        <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
      </div>
    </Tabs>
  );
}
