import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string(),
  title: z.string(),
  role: z.string(),
  institute: z.string(),
  authorName: z.string(),
});

export const socialSchema = z.object({
  email: z.string().email(),
  linkedin: z.string().url().or(z.literal("")),
  x: z.string().url().or(z.literal("")),
  github: z.string().url().or(z.literal("")),
  gitlab: z.string().url().or(z.literal("")),
  scholar: z.string().url().or(z.literal("")),
  inspire: z.string().url().or(z.literal("")),
  arxiv: z.string().url().or(z.literal("")),
});

export const seoSchema = z.object({
  defaultTitle: z.string(),
  defaultDescription: z.string(),
  defaultImage: z.string(),
});

export const siteConfigSchema = z.object({
  profile: profileSchema,
  social: socialSchema,
  seo: seoSchema,
});

export type Profile = z.infer<typeof profileSchema>;
export type Social = z.infer<typeof socialSchema>;
export type SeoConfig = z.infer<typeof seoSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
