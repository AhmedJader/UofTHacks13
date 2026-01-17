import { ProtectedLayout } from "@/app/_routes/protected-layout";

export default async function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
