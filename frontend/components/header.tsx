import { SignedIn, UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";

type HeaderProps = {
  user: User | null;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Map" },
  // { href: "/upload", label: "Upload" },
  { href: "/analytics", label: "Analytics" },
] as const;

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 flex items-center h-16 border-b border-slate-700/60 backdrop-blur supports-[backdrop-filter]:bg-slate-900 text-white">
      <div className="flex items-center w-full justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center mr-4 cursor-pointer shrink-0"
          >
            <Image
              src="/cctv/image-removebg-preview.png"
              alt="Logo"
              width={90}
              height={45}
              className="object-contain hover:opacity-80 transition"
              priority
            />
          </Link>

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:text-slate-300"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ClerkLoading>
            <div className="flex gap-2 items-center">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            {user && (
              <span className="text-sm text-slate-300">
                Hello, {user.primaryEmailAddress?.emailAddress}!
              </span>
            )}
          </ClerkLoaded>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
