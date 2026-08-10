import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";

const ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/reference", changeFrequency: "monthly", priority: 0.9 },
  { path: "/examples", changeFrequency: "monthly", priority: 0.8 },
  { path: "/benchmark", changeFrequency: "monthly", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
