import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const Users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk userId
  createdAt: timestamp('created_at').defaultNow().notNull(),
  displayName: text('display_name'),
})
