import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ensureUserExists } from '../actions'
import { SignedIn, UserButton } from '@clerk/nextjs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // 👇 THIS is where your schema “gets hit”
  await ensureUserExists()

  return (
    <>
      <header className="flex justify-end items-center p-4 h-16 border-b">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main>{children}</main>
    </>
  )
}
