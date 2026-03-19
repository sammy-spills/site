"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Publication } from "@/lib/schemas/content";

const TAB_ORDER = [
  "Journal Article",
  "Conference Paper",
  "Book Chapter",
  "Edited Book",
  "Report",
  "Preprint",
  "Web Article",
] as const;

function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{pub.title}</CardTitle>
        <CardDescription>{pub.authors}</CardDescription>
        {pub.editors ? (
          <CardDescription>Edited by {pub.editors}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm">
          {pub.venue}
          {pub.venue && pub.date ? " · " : ""}
          {pub.date}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{pub.type}</Badge>
          {pub.link ? (
            <Link href={pub.link} rel="noopener noreferrer" target="_blank">
              <Badge variant="outline">
                <ExternalLink data-icon="inline-start" />
                View publication
              </Badge>
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
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
    <Tabs defaultValue="all">
      <TabsList className="h-auto overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TabsTrigger value="all">All ({publications.length})</TabsTrigger>
        {tabs.map((type) => (
          <TabsTrigger key={type} value={type}>
            {type === "Journal Article" ? "Journal Articles" : `${type}s`} (
            {grouped.get(type)?.length})
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all">
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <PublicationCard
              key={`${pub.title}-${pub.type}-${index}`}
              pub={pub}
            />
          ))}
        </div>
      </TabsContent>

      {tabs.map((type) => (
        <TabsContent key={type} value={type}>
          <div className="space-y-4">
            {grouped.get(type)?.map((pub, index) => (
              <PublicationCard
                key={`${pub.title}-${pub.type}-${index}`}
                pub={pub}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
