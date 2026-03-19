import { z } from "zod";

const stringField = z.string().default("");
const urlField = z.string().url().or(z.literal("")).default("");
const emailField = z.string().email().or(z.literal("")).default("");

export const profileSchema = z.object({
  fullName: stringField,
  title: stringField,
  role: stringField,
  institute: stringField,
  instituteUrl: stringField,
  authorName: stringField,
  image: stringField,
});

export const socialSchema = z.object({
  email: emailField,
  linkedin: urlField,
  x: urlField,
  github: urlField,
  gitlab: urlField,
  scholar: urlField,
  inspire: urlField,
  arxiv: urlField,
});

export const seoSchema = z.object({
  defaultTitle: stringField,
  defaultDescription: stringField,
  defaultImage: stringField,
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
