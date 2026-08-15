import type { MetadataRoute } from "next";
import { practices } from "@/lib/practices";
import { publishedSectors } from "@/lib/sectors";
import { getCollection } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Generated from the same data that renders the pages, so it cannot drift.
 * This replaces the hand-maintained sitemap.xml on the old static site.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${site.url}${p}`;

  const statics: MetadataRoute.Sitemap = [
    { url: u("/"), priority: 1, changeFrequency: "monthly" },
    { url: u("/work"), priority: 0.9, changeFrequency: "monthly" },
    { url: u("/sectors"), priority: 0.7, changeFrequency: "monthly" },
    { url: u("/insights"), priority: 0.8, changeFrequency: "weekly" },
    { url: u("/partners"), priority: 0.6, changeFrequency: "yearly" },
    { url: u("/about"), priority: 0.7, changeFrequency: "yearly" },
    { url: u("/capability"), priority: 0.7, changeFrequency: "monthly" },
    { url: u("/contact"), priority: 0.9, changeFrequency: "yearly" },
    { url: u("/privacy"), priority: 0.2, changeFrequency: "yearly" },
    { url: u("/terms"), priority: 0.2, changeFrequency: "yearly" },
  ];

  const practicePages = practices.map((p) => ({
    url: u(`/work/${p.slug}`),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const sectorPages = publishedSectors().map((s) => ({
    url: u(`/sectors/${s.slug}`),
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const insights = (await getCollection("insights")).map((d) => ({
    url: u(`/insights/${d.slug}`),
    lastModified: new Date(d.date),
    priority: 0.6,
    changeFrequency: "yearly" as const,
  }));

  return [...statics, ...practicePages, ...sectorPages, ...insights];
}
