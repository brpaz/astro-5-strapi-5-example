import { defineCollection, z } from "astro:content";
import qs from "qs";

// Define a custom content collection that loads data from Strapi
const strapiPostsLoader = defineCollection({
  // Async loader function that fetches data from Strapi API
  loader: async () => {
    // Get Strapi URL from environment variables or fallback to localhost
    console.log(import.meta.env.STRAPI_URL);
    const BASE_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
    const path = "/api/articles";
    const url = new URL(path, BASE_URL);

    // Build query parameters using qs to populate cover image data
    url.search = qs.stringify({
      populate: {
        cover: {
          fields: ["url", "alternativeText"],
        },
      },
    });

    // Fetch articles from Strapi
    const articlesData = await fetch(url.href);
    const { data }= await articlesData.json();

    if (!data || !Array.isArray(data)) {
      return []
    }

    // Transform the API response into the desired data structure
    return data.map((item) => ({
      id: item.id.toString(),
      title: item.title,
      description: item.description,
      slug: item.slug,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
      cover: {
        id: Number(item.cover.id),
        documentId: item.cover.documentId,
        url: item.cover.url,
        alternativeText: item.cover.alternativeText,
      }
    }));
  },
  // Define the schema for type validation using Zod
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    cover: z.object({
      id: z.number(),
      documentId: z.string(),
      url: z.string(),
      alternativeText: z.string(),
    }),
  }),
});

// Export the collection for use in Astro pages
export const collections = {
  strapiPostsLoader,
};