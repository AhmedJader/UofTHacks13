import { ProtectedLayout } from "@/app/_routes/protected-layout";

export default async function AnalyticsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedLayout>{children}</ProtectedLayout>;
}
