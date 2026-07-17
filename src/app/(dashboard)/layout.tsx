import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { requireAuthenticatedUser } from "@/server/auth/session";

import { signOutAction } from "./actions";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthenticatedUser();

  return (
    <AppShell
      signOutAction={signOutAction}
      user={{ email: user.email, name: user.name }}
    >
      {children}
    </AppShell>
  );
}
