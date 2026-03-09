import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/login"],
    },
    sitemap: "https://madeenawarriors2k18.vercel.app/sitemap.xml",
  }
}
