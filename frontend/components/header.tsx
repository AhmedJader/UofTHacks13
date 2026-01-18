import { SignedIn, UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";

type HeaderProps = {
  user: User | null;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/map", label: "Map" },
  { href: "/upload", label: "Upload" },
  { href: "/analytics", label: "Analytics" },
] as const;

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="flex justify-end items-center p-4 h-16 border-b">
      <div className="flex items-center gap-1 px-4 w-full justify-between">
        <div>
          {NAV_ITEMS.map((item) => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div>
          <ClerkLoading>
            <div className="flex row gap-2 items-center">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            {user && (
              <span className="mr-2">
                Hello, {user?.primaryEmailAddress?.emailAddress}!
              </span>
            )}
          </ClerkLoaded>
        </div>
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};
