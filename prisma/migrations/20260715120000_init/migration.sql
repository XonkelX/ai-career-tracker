-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED');

-- CreateEnum
CREATE TYPE "SalaryPeriod" AS ENUM ('HOURLY', 'MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "AiArtifactType" AS ENUM ('RESUME_ANALYSIS', 'PROFESSIONAL_SUMMARY', 'COVER_LETTER', 'INTERVIEW_QUESTIONS');

-- CreateEnum
CREATE TYPE "AiArtifactStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('APPLICATION_CREATED', 'APPLICATION_UPDATED', 'STATUS_CHANGED', 'RESUME_LINKED', 'AI_ARTIFACT_CREATED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "location" TEXT,
    "jobUrl" TEXT,
    "jobDescription" TEXT,
    "salaryMinMinor" BIGINT,
    "salaryMaxMinor" BIGINT,
    "salaryCurrency" VARCHAR(3),
    "salaryPeriod" "SalaryPeriod",
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SAVED',
    "dateApplied" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "notes" TEXT,
    "resumeVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_versions" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "contentHash" TEXT NOT NULL,
    "extractedText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_artifacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "resumeVersionId" TEXT,
    "type" "AiArtifactType" NOT NULL,
    "status" "AiArtifactStatus" NOT NULL DEFAULT 'PENDING',
    "model" TEXT,
    "sourceSnapshot" JSONB NOT NULL,
    "output" JSONB,
    "errorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "aiArtifactId" TEXT,
    "type" "ActivityType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "job_applications_userId_status_idx" ON "job_applications"("userId", "status");

-- CreateIndex
CREATE INDEX "job_applications_userId_deadline_idx" ON "job_applications"("userId", "deadline");

-- CreateIndex
CREATE INDEX "job_applications_userId_dateApplied_idx" ON "job_applications"("userId", "dateApplied");

-- CreateIndex
CREATE INDEX "resumes_userId_idx" ON "resumes"("userId");

-- CreateIndex
CREATE INDEX "resume_versions_resumeId_idx" ON "resume_versions"("resumeId");

-- CreateIndex
CREATE UNIQUE INDEX "resume_versions_resumeId_version_key" ON "resume_versions"("resumeId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "resume_versions_resumeId_contentHash_key" ON "resume_versions"("resumeId", "contentHash");

-- CreateIndex
CREATE INDEX "ai_artifacts_userId_type_createdAt_idx" ON "ai_artifacts"("userId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "ai_artifacts_applicationId_idx" ON "ai_artifacts"("applicationId");

-- CreateIndex
CREATE INDEX "activities_userId_createdAt_idx" ON "activities"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "activities_applicationId_idx" ON "activities"("applicationId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resumeVersionId_fkey" FOREIGN KEY ("resumeVersionId") REFERENCES "resume_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_artifacts" ADD CONSTRAINT "ai_artifacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_artifacts" ADD CONSTRAINT "ai_artifacts_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_artifacts" ADD CONSTRAINT "ai_artifacts_resumeVersionId_fkey" FOREIGN KEY ("resumeVersionId") REFERENCES "resume_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_aiArtifactId_fkey" FOREIGN KEY ("aiArtifactId") REFERENCES "ai_artifacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
