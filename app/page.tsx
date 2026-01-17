import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  // If signed in, go straight to dashboard
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Welcome</h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Sign in to access your dashboard and start using the app.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/sign-in"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent transition"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
