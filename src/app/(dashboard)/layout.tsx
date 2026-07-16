import { AppShell } from "@/components/layout/app-shell";
import { requireAuthenticatedUser } from "@/server/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthenticatedUser();

  return <AppShell>{children}</AppShell>;
}
