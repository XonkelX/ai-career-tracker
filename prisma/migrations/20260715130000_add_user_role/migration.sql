-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER');

-- AlterTable
ALTER TABLE "users"
ALTER COLUMN "email" DROP NOT NULL,
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';
