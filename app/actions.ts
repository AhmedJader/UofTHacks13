'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from './db'
import { Users } from './db/schema'

export async function ensureUserExists() {
  const { userId } = await auth()
  if (!userId) throw new Error('Not authenticated')

  await db
    .insert(Users)
    .values({ id: userId })
    .onConflictDoNothing()
}
