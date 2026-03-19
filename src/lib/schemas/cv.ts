import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string(),
  time: z.string(),
  title: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  school: z.string(),
  time: z.string(),
  degree: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export const awardSchema = z.object({
  title: z.string(),
  organization: z.string(),
  time: z.string(),
  location: z.string().optional(),
  value: z.string(),
  description: z.string(),
});

export const professionalServiceSchema = z.object({
  title: z.string(),
  role: z.string(),
  organization: z.string(),
  time: z.string(),
  description: z.string().optional(),
});

export const skillSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconName: z.string(),
});

export const presentationSchema = z.object({
  year: z.string(),
  title: z.string(),
  venue: z.string(),
  link: z.string().url().nullable(),
});

export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Award = z.infer<typeof awardSchema>;
export type ProfessionalService = z.infer<typeof professionalServiceSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Presentation = z.infer<typeof presentationSchema>;
