import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="relative min-h-screen bg-black overflow-hidden font-sans">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-top"
        style={{ backgroundImage: "url(/cctv/background.webp)" }}
      />

      {/* Base darkening layer (CRITICAL) */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Optional vignette */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-black/20 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-2xl text-center">

          {/* System label */}
          <p className="mb-6 text-xs uppercase tracking-[0.32em] text-neutral-400 opacity-0 animate-fade animate-fill-forwards">
            Identity · Continuity · Assistive AI
          </p>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-medium leading-tight tracking-[-0.015em] text-white opacity-0 animate-fade animate-delay-[150ms] animate-fill-forwards">
            When identity slips,
            <br />
            <span className="text-neutral-200">
              behavior speaks first.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg leading-relaxed text-neutral-200 opacity-0 animate-fade animate-delay-[300ms] animate-fill-forwards">
            Self-Continuity Guard uses real-time behavioral signals and video
            understanding to detect moments of spatial or contextual confusion —
            and respond gently, before distress escalates.
          </p>

          {/* Capability hints */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-300 opacity-0 animate-fade animate-delay-[450ms] animate-fill-forwards">
            <span>Pose-based behavioral signals</span>
            <span>Temporal video reasoning</span>
            <span>Caregiver-in-the-loop responses</span>
          </div>

          {/* Divider */}
          <div className="mx-auto mt-10 h-px w-24 bg-neutral-600 opacity-0 animate-fade animate-delay-[600ms] animate-fill-forwards" />

          {/* CTAs */}
          <div className="mt-10 flex justify-center gap-6 opacity-0 animate-fade animate-delay-[750ms] animate-fill-forwards">
            <Link
              href="/sign-in"
              className="rounded-md bg-white px-6 py-3 text-sm font-medium text-black hover:bg-neutral-200 transition"
            >
              Enter system
            </Link>

            <Link
              href="/sign-up"
              className="rounded-md border border-neutral-600 px-6 py-3 text-sm font-medium text-neutral-100 hover:bg-neutral-900 transition"
            >
              Create demo account
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
