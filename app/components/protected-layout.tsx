import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureUserExists } from "@/app/actions";
import { Header } from "@/components/header";

type ProtectedLayoutProps = {
  children: React.ReactNode;
  toggleEmail?: boolean;
};

export async function ProtectedLayout({
  children,
  toggleEmail = true,
}: ProtectedLayoutProps) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) redirectToSignIn();

  await ensureUserExists();

  const user = toggleEmail ? await currentUser() : null;

  return (
    <>
      <Header user={user} />
      <main>{children}</main>
    </>
  );
}
