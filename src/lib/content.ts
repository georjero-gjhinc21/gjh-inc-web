import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

/**
 * File-based content. Markdown in /content, rendered at build time.
 *
 * Why files and not a CMS: the whole site is statically generated, which is
 * what gets us the performance and crawlability targets without a database
 * on the critical path. When editorial volume justifies it, swap this module
 * for a CMS adapter — nothing else needs to change. See docs/ARCHITECTURE.md.
 */

const ROOT = path.join(process.cwd(), "content");

export type Doc = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  topic: string;
  author?: string;
  readingTime: number;
  body: string; // rendered HTML
};

function readCollection(dir: string): { slug: string; raw: string }[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, ""), raw: fs.readFileSync(path.join(full, f), "utf8") }));
}

async function toDoc(slug: string, raw: string): Promise<Doc> {
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;
  const processed = await remark().use(html, { sanitize: false }).process(content);
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    topic: data.topic ?? "General",
    author: data.author,
    readingTime: Math.max(1, Math.round(words / 220)),
    body: processed.toString(),
  };
}

export async function getCollection(dir: "insights"): Promise<Doc[]> {
  const docs = await Promise.all(readCollection(dir).map(({ slug, raw }) => toDoc(slug, raw)));
  return docs.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getDoc(dir: "insights", slug: string): Promise<Doc | null> {
  const file = path.join(ROOT, dir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return toDoc(slug, fs.readFileSync(file, "utf8"));
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
