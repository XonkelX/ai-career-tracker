-- Extend resume versions for metadata-only management. Upload fields remain
-- available for a future file-storage story but are not required in Version 1.
ALTER TABLE "resume_versions"
ADD COLUMN "versionLabel" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "notes" TEXT;

UPDATE "resume_versions"
SET "versionLabel" = 'Version ' || "version"::TEXT
WHERE "versionLabel" IS NULL;

ALTER TABLE "resume_versions"
ALTER COLUMN "versionLabel" SET NOT NULL,
ALTER COLUMN "originalFileName" DROP NOT NULL,
ALTER COLUMN "storageKey" DROP NOT NULL,
ALTER COLUMN "mimeType" DROP NOT NULL,
ALTER COLUMN "fileSizeBytes" DROP NOT NULL,
ALTER COLUMN "contentHash" DROP NOT NULL;

DROP INDEX "resumes_userId_idx";
CREATE UNIQUE INDEX "resumes_userId_name_key" ON "resumes"("userId", "name");
