import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk userId
  createdAt: timestamp("created_at").defaultNow().notNull(),
  displayName: text("display_name"),
});

export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  cameraSrc: text("camera_src").notNull(),
  videoId: text("video_id").notNull(),
});
