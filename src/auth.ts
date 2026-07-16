import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { authConfig } from "@/server/auth/config";
import { prisma } from "@/server/db/client";

export const { auth, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
});
