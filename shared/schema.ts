import { z } from "zod";

// Portfolio item schema
export const portfolioItemSchema = z.object({
  site: z.string().url(),
  description: z.string(),
  title: z.string().optional(),
  fileName: z.string(),
});

export type PortfolioItem = z.infer<typeof portfolioItemSchema>;
