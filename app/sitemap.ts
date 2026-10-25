import type { MetadataRoute } from "next"
import { site } from "@/content/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/association`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/equipe`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/bio-innov-2027`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/evenements`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/biomateriaux`, changeFrequency: "monthly", priority: 0.7 },
  ]
}
