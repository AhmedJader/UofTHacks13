"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { assets, Users } from "./db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export async function ensureUserExists() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await db.insert(Users).values({ id: userId }).onConflictDoNothing();
}

export async function insertAssetIntoDbIfNotExists(
  camera_src: string,
  video_id: string,
) {
  await db
    .insert(assets)
    .values({
      id: uuidv4(),
      cameraSrc: camera_src,
      videoId: video_id,
    })
    .onConflictDoNothing();
}

export async function getAssetIfExists(camera_src: string) {
  const camera = await db.query.assets.findFirst({
    where: eq(assets.cameraSrc, camera_src),
  });

  if (!camera) {
    return null;
  }

  return camera;
}
