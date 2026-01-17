import { ProtectedLayout } from "@/app/components/protected-layout";

export default async function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
