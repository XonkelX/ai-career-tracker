import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

export const getServerSession = cache(async () => auth());

export async function requireAuthenticatedUser() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session.user;
}
