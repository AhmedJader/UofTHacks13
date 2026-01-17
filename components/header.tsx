import { SignedIn, UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

type HeaderProps = {
  user: User | null;
};

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="flex justify-end items-center p-4 h-16 border-b">
      <div>
        <ClerkLoading>
          <div className="flex row gap-2 items-center">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          {user && (
            <span className="mr-4">
              Hello, {user?.primaryEmailAddress?.emailAddress}!
            </span>
          )}
        </ClerkLoaded>
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};
