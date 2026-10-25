import type { MetadataRoute } from "next"
import { site } from "@/content/site"

export default function robots(): MetadataRoute.Robots {
  // Avant le lancement officiel, on demande aux moteurs de recherche de ne rien parcourir.
  if (!site.ouvertAuxMoteursDeRecherche) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
