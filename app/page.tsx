import { ensureUserExists } from './actions'

export default async function Home() {
  await ensureUserExists()

  return (
    <main>
      <h1>User initialized</h1>
      <p>Account exists in database.</p>
    </main>
  )
}
