import { z } from "zod";

export const researchAreaSchema = z.object({
  title: z.string(),
  description: z.string(),
  field: z.string(),
  iconName: z.string(),
});

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  role: z.string().optional(),
  image: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
});

export const publicationSchema = z.object({
  title: z.string(),
  authors: z.string(),
  editors: z.string().optional(),
  venue: z.string(),
  date: z.string(),
  type: z.string(),
  link: z.string().optional(),
  abstract: z.string().optional(),
});

export const blogFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  image: z.string().optional(),
  published: z.boolean().default(true),
});

export type ResearchArea = z.infer<typeof researchAreaSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Publication = z.infer<typeof publicationSchema>;
export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
