import { z } from "zod";
import awardsData from "@/data/awards.json";
import educationData from "@/data/education.json";
import experienceData from "@/data/experience.json";
import presentationsData from "@/data/presentations.json";
import professionalServiceData from "@/data/professional-service.json";
import projectsData from "@/data/projects.json";
import researchAreasData from "@/data/research-areas.json";
import siteData from "@/data/site.json";
import skillsData from "@/data/skills.json";
import { projectSchema, researchAreaSchema } from "@/lib/schemas/content";
import {
  awardSchema,
  educationSchema,
  experienceSchema,
  presentationSchema,
  professionalServiceSchema,
  skillSchema,
} from "@/lib/schemas/cv";
import { siteConfigSchema } from "@/lib/schemas/site";

export const experiences = z.array(experienceSchema).parse(experienceData);
export const education = z.array(educationSchema).parse(educationData);
export const awards = z.array(awardSchema).parse(awardsData);
export const professionalService = z
  .array(professionalServiceSchema)
  .parse(professionalServiceData);
export const skills = z.array(skillSchema).parse(skillsData);
export const presentations = z
  .array(presentationSchema)
  .parse(presentationsData);
export const researchAreas = z
  .array(researchAreaSchema)
  .parse(researchAreasData);
export const projects = z.array(projectSchema).parse(projectsData);
export const site = siteConfigSchema.parse(siteData);
