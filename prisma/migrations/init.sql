-- Job Finder Pro – Powered by IAMTECHNI
-- Initial PostgreSQL Migration Schema

CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE "WorkLocationType" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE', 'TEMPORARY');
CREATE TYPE "ExperienceLevel" AS ENUM ('FRESHER', 'INTERNSHIP', 'ENTRY_LEVEL', 'ONE_TO_TWO_YEARS', 'THREE_TO_FIVE_YEARS', 'FIVE_TO_TEN_YEARS', 'TEN_PLUS_YEARS');
CREATE TYPE "EducationLevel" AS ENUM ('NO_DEGREE', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'DOCTORATE', 'OTHER');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'EXPIRED', 'ARCHIVED');
CREATE TYPE "JobSourceType" AS ENUM ('ADMIN_MANUAL', 'AUTOMATED_FEED', 'LICENSED_PARTNER');
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'PUBLISHED');
CREATE TYPE "AlertFrequency" AS ENUM ('INSTANT', 'DAILY', 'WEEKLY');
CREATE TYPE "NotificationType" AS ENUM ('JOB_ALERT_MATCH', 'SAVED_JOB_UPDATE', 'EXPIRED_NOTICE', 'APPLICATION_REMINDER', 'SYSTEM_ANNOUNCEMENT');
CREATE TYPE "ThemePreference" AS ENUM ('SYSTEM', 'LIGHT', 'DARK');

-- 1. Users
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT,
    "googleId" TEXT UNIQUE,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3)
);

-- 2. User Profiles
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "headline" TEXT,
    "bio" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "state" TEXT,
    "city" TEXT,
    "preferredSalaryMin" INTEGER,
    "preferredSalaryMax" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'INR',
    "experienceLevel" "ExperienceLevel",
    "educationLevel" "EducationLevel",
    "preferredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "resumeUrl" TEXT,
    "resumeFileName" TEXT,
    "portfolioUrl" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Preferences
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "theme" "ThemePreference" NOT NULL DEFAULT 'SYSTEM',
    "enablePushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "enableEmailAlerts" BOOLEAN NOT NULL DEFAULT true,
    "enableInAppAlerts" BOOLEAN NOT NULL DEFAULT true,
    "fcmToken" TEXT,
    "preferredLocationType" "WorkLocationType",
    "allowDataSharing" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Companies
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "email" TEXT,
    "description" TEXT,
    "country" TEXT,
    "city" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Job Sources
CREATE TABLE "JobSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "type" "JobSourceType" NOT NULL DEFAULT 'AUTOMATED_FEED',
    "feedUrl" TEXT,
    "websiteUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "totalJobsFetched" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Categories
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "iconName" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Admin Users
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Jobs
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE,
    "categoryId" TEXT REFERENCES "Category"("id") ON DELETE SET NULL,
    "sourceId" TEXT REFERENCES "JobSource"("id") ON DELETE SET NULL,
    "sourceType" "JobSourceType" NOT NULL DEFAULT 'AUTOMATED_FEED',
    "externalSourceRef" TEXT,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiredSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experienceRequirement" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'ENTRY_LEVEL',
    "educationRequirement" TEXT NOT NULL,
    "educationLevel" "EducationLevel" NOT NULL DEFAULT 'BACHELORS',
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'INR',
    "salaryPeriod" TEXT NOT NULL DEFAULT 'yearly',
    "isSalaryDisclosed" BOOLEAN NOT NULL DEFAULT true,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "workLocationType" "WorkLocationType" NOT NULL DEFAULT 'ONSITE',
    "country" TEXT NOT NULL DEFAULT 'India',
    "state" TEXT,
    "city" TEXT NOT NULL,
    "locationString" TEXT NOT NULL,
    "isRemoteEligible" BOOLEAN NOT NULL DEFAULT false,
    "visaSponsorship" BOOLEAN NOT NULL DEFAULT false,
    "relocationAssistance" BOOLEAN NOT NULL DEFAULT false,
    "internationalApplicantsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "immediateJoining" BOOLEAN NOT NULL DEFAULT false,
    "applicationUrl" TEXT NOT NULL,
    "applicationEmail" TEXT,
    "isExternalApplication" BOOLEAN NOT NULL DEFAULT true,
    "status" "JobStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "adminPosted" BOOLEAN NOT NULL DEFAULT false,
    "postedByAdminId" TEXT REFERENCES "AdminUser"("id") ON DELETE SET NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uniq_job_ref_source" UNIQUE ("externalSourceRef", "sourceId")
);

-- 9. Saved Jobs
CREATE TABLE "SavedJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "jobId" TEXT NOT NULL REFERENCES "Job"("id") ON DELETE CASCADE,
    "notes" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uniq_user_saved_job" UNIQUE ("userId", "jobId")
);

-- 10. Job Alerts
CREATE TABLE "JobAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "keywords" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "country" TEXT DEFAULT 'India',
    "state" TEXT,
    "city" TEXT,
    "categorySlug" TEXT,
    "employmentType" "EmploymentType",
    "workLocationType" "WorkLocationType",
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'INR',
    "experienceLevel" "ExperienceLevel",
    "isRemoteOnly" BOOLEAN NOT NULL DEFAULT false,
    "frequency" "AlertFrequency" NOT NULL DEFAULT 'DAILY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pushNotificationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailNotificationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggeredAt" TIMESTAMP(3),
    "matchCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Employer Requests (Email-Only Intake)
CREATE TABLE "EmployerRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referenceId" TEXT NOT NULL UNIQUE,
    "employerName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "mobileNumber" TEXT,
    "jobTitle" TEXT NOT NULL,
    "vacanciesCount" INTEGER NOT NULL DEFAULT 1,
    "jobLocation" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "shortJobDescription" TEXT NOT NULL,
    "companyWebsite" TEXT,
    "additionalMessage" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "adminReviewNotes" TEXT,
    "reviewedByAdminId" TEXT,
    "convertedToJobId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Notifications
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "jobId" TEXT REFERENCES "Job"("id") ON DELETE CASCADE,
    "type" "NotificationType" NOT NULL DEFAULT 'JOB_ALERT_MATCH',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Audit Logs
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT REFERENCES "AdminUser"("id") ON DELETE SET NULL,
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning-fast queries
CREATE INDEX "idx_user_email" ON "User"("email");
CREATE INDEX "idx_job_location" ON "Job"("country", "state", "city");
CREATE INDEX "idx_job_status_posted" ON "Job"("status", "postedAt");
CREATE INDEX "idx_job_type_location" ON "Job"("employmentType", "workLocationType");
CREATE INDEX "idx_job_salary" ON "Job"("salaryMin", "salaryMax");
CREATE INDEX "idx_employer_req_status" ON "EmployerRequest"("status");
