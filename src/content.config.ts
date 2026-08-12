import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum([
      'overview', 'mode', 'operator',
      'weapon', 'map', 'economy',
      'beginner', 'season',
    ]),
    tags: z.array(z.string()).optional(),
    heroImage: z.string(),
    readTime: z.number(),
    author: z.string().default('Delta Force Guide Team'),
    featured: z.boolean().default(false),
  }),
});

export const collections = { articles };
