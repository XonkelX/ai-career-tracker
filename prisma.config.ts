import "dotenv/config";
import { defineConfig } from "prisma/config";

import { getDatabaseEnvironment } from "./src/server/env/database";

const { DATABASE_URL } = getDatabaseEnvironment();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
