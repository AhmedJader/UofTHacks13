import {
  SignedIn,
  UserButton,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

type HeaderProps = {
  user: User | null;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Map" },
  { href: "/analytics", label: "Analytics" },
] as const;

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 h-16 bg-black border-b border-neutral-800">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center mr-4 shrink-0"
          >
            <Image
              src="/cctv/image-removebg-preview.png"
              alt="Logo"
              width={90}
              height={45}
              priority
              className="object-contain opacity-90 hover:opacity-100 transition"
            />
          </Link>

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                px-3 py-2 rounded-md text-sm font-medium
                text-neutral-400
                hover:text-white
                hover:bg-neutral-900
                transition
              "
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ClerkLoading>
            <div className="flex gap-2 items-center">
              <div className="h-6 w-40 bg-neutral-800 rounded animate-pulse" />
              <div className="h-8 w-8 bg-neutral-800 rounded-full animate-pulse" />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            {user && (
              <span className="text-sm text-neutral-400 hidden sm:block">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            )}
          </ClerkLoaded>

          <SignedIn>
            <div className="ml-1 border-l border-neutral-800 pl-3">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
