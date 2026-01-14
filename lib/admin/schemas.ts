import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  category: z.enum([
    "hackathon",
    "exhibition",
    "competition",
    "workshop",
    "session",
  ]),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  maxScore: z.coerce.number().min(0).default(100),
  isActive: z.boolean().default(true),
});

export type EventFormData = z.infer<typeof eventFormSchema>;
