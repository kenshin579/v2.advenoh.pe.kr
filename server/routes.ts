import type { Express } from "express";
import { createServer, type Server } from "http";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { portfolioItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to get portfolio items from markdown files
  app.get("/api/portfolio", async (req, res) => {
    try {
      const contentDir = path.join(process.cwd(), "contents", "website");
      
      // Check if directory exists
      try {
        await fs.access(contentDir);
      } catch {
        // Directory doesn't exist, return empty array
        return res.json([]);
      }

      // Read all files in the directory
      const files = await fs.readdir(contentDir);
      const markdownFiles = files.filter(file => file.endsWith('.md'));

      if (markdownFiles.length === 0) {
        return res.json([]);
      }

      // Parse each markdown file
      const portfolioItems = await Promise.all(
        markdownFiles.map(async (file) => {
          const filePath = path.join(contentDir, file);
          const fileContent = await fs.readFile(filePath, "utf-8");
          const { data } = matter(fileContent);

          // Validate and return portfolio item
          const result = portfolioItemSchema.safeParse({
            site: data.site,
            description: data.description,
            title: data.title,
            fileName: file,
          });

          if (!result.success) {
            console.error(`Invalid markdown file ${file}:`, result.error);
            return null;
          }

          return result.data;
        })
      );

      // Filter out any invalid items and sort by filename for consistent ordering
      const validItems = portfolioItems
        .filter(item => item !== null)
        .sort((a, b) => a!.fileName.localeCompare(b!.fileName));

      res.json(validItems);
    } catch (error) {
      console.error("Error reading portfolio items:", error);
      res.status(500).json({ error: "Failed to load portfolio items" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
