"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { assets, Users } from "./db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

/**
 * Ensure the authenticated user exists in DB
 * This MAY throw (auth failure is fatal)
 */
export async function ensureUserExists() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await db
    .insert(Users)
    .values({ id: userId })
    .onConflictDoNothing();
}

/**
 * Best-effort insert.
 * NEVER throws.
 * NEVER breaks page rendering.
 */
export async function insertAssetIntoDbIfNotExists(
  camera_src: string,
  video_id: string,
) {
  try {
    await db
      .insert(assets)
      .values({
        id: uuidv4(),
        cameraSrc: camera_src,
        videoId: video_id,
      })
      .onConflictDoNothing({ target: assets.cameraSrc });

    return { success: true };
  } catch (err) {
    // 🔑 This is CRITICAL — swallow DB errors
    console.warn(
      "insertAssetIntoDbIfNotExists failed (non-fatal):",
      err
    );
    return { success: false };
  }
}

/**
 * Safe read — fine to throw if DB is down
 */
export async function getAssetIfExists(camera_src: string) {
  try {
    const camera = await db.query.assets.findFirst({
      where: eq(assets.cameraSrc, camera_src),
    });

    return camera ?? null;
  } catch (err) {
    console.error("getAssetIfExists failed:", err);
    return null;
  }
}
