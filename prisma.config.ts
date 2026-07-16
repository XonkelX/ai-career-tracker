import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Client generation does not require a live database. Database commands
    // still fail clearly unless DATABASE_URL is supplied by the environment.
    url: process.env.DATABASE_URL ?? "",
  },
});
