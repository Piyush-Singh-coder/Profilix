-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GITHUB', 'GOOGLE');

-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('LOOKING_FOR_ROLES', 'OPEN_TO_HACKATHONS', 'BUILDING_SOMETHING', 'AVAILABLE_FOR_FREELANCE', 'NOT_AVAILABLE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TechCategory" AS ENUM ('LANGUAGE', 'FRAMEWORK', 'DATABASE', 'DEVOPS', 'TOOL', 'CLOUD', 'OTHER');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('GITHUB', 'LINKEDIN', 'TWITTER', 'LEETCODE', 'HACKERRANK', 'PERSONAL_WEBSITE', 'OTHER');

-- CreateEnum
CREATE TYPE "QRVariant" AS ENUM ('STANDARD', 'LOCK_SCREEN');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('PROFILE_VIEW', 'RESUME_DOWNLOAD', 'SOCIAL_LINK_CLICK', 'QR_SCAN', 'OG_IMAGE_RENDER');

-- CreateEnum
CREATE TYPE "ProfileTheme" AS ENUM ('GLASS', 'BRUTALISM', 'CLAY', 'SKEUOMORPHIC', 'MINIMAL', 'NEON', 'RETRO', 'AURORA');

-- CreateEnum
CREATE TYPE "CardTheme" AS ENUM ('GLASSMORPHISM', 'NEOBRUTALISM', 'APPLE', 'CLAY', 'SKEUOMORPHIC');

-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('HACKATHON', 'COMPETITION', 'CERTIFICATE', 'AWARD', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255),
    "firebase_uid" VARCHAR(128),
    "auth_provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "headline" VARCHAR(150),
    "bio" TEXT,
    "status" "ProfileStatus" NOT NULL DEFAULT 'NOT_AVAILABLE',
    "status_custom_text" VARCHAR(100),
    "location" VARCHAR(100),
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "theme" "ProfileTheme" NOT NULL DEFAULT 'GLASS',
    "card_theme" "CardTheme" NOT NULL DEFAULT 'GLASSMORPHISM',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_stacks" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "icon_url" TEXT,
    "category" "TechCategory" NOT NULL DEFAULT 'OTHER',

    CONSTRAINT "tech_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_tech_stacks" (
    "profile_id" UUID NOT NULL,
    "tech_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_tech_stacks_pkey" PRIMARY KEY ("profile_id","tech_id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "bullets" JSONB,
    "repo_url" TEXT,
    "live_url" TEXT,
    "video_url" TEXT,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "tech_tags" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "url" TEXT NOT NULL,
    "visible_in_default" BOOLEAN NOT NULL DEFAULT true,
    "visible_in_recruiter" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "file_url" TEXT NOT NULL,
    "cloudinary_id" VARCHAR(255) NOT NULL,
    "original_filename" VARCHAR(255) NOT NULL,
    "file_size_bytes" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "variant" "QRVariant" NOT NULL DEFAULT 'STANDARD',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "event_type" "AnalyticsEventType" NOT NULL,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip_hash" VARCHAR(64),
    "metadata" JSONB,
    "timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_stats" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "github_username" VARCHAR(100) NOT NULL,
    "total_repos" INTEGER NOT NULL DEFAULT 0,
    "total_stars" INTEGER NOT NULL DEFAULT 0,
    "total_forks" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "following" INTEGER NOT NULL DEFAULT 0,
    "contributions" JSONB,
    "pinned_repos" JSONB,
    "avatar_url" TEXT,
    "bio" TEXT,
    "company" VARCHAR(100),
    "blog" TEXT,
    "location" VARCHAR(100),
    "last_synced" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "github_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "company" VARCHAR(150) NOT NULL,
    "role" VARCHAR(150) NOT NULL,
    "location" VARCHAR(100),
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "bullets" JSONB,
    "logo_url" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "provider" VARCHAR(150),
    "type" "AchievementType" NOT NULL DEFAULT 'OTHER',
    "date" DATE,
    "url" TEXT,
    "image_url" TEXT,
    "cloudinary_id" VARCHAR(255),
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "school" VARCHAR(200) NOT NULL,
    "degree" VARCHAR(150),
    "field_of_study" VARCHAR(150),
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "bullets" JSONB,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_firebase_uid_idx" ON "users"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tech_stacks_name_key" ON "tech_stacks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tech_stacks_slug_key" ON "tech_stacks"("slug");

-- CreateIndex
CREATE INDEX "tech_stacks_category_idx" ON "tech_stacks"("category");

-- CreateIndex
CREATE INDEX "projects_user_id_is_pinned_idx" ON "projects"("user_id", "is_pinned");

-- CreateIndex
CREATE INDEX "projects_user_id_display_order_idx" ON "projects"("user_id", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "social_links_user_id_platform_key" ON "social_links"("user_id", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_user_id_key" ON "resumes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_user_id_variant_key" ON "qr_codes"("user_id", "variant");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_event_type_idx" ON "analytics_events"("user_id", "event_type");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_timestamp_idx" ON "analytics_events"("user_id", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "github_stats_user_id_key" ON "github_stats"("user_id");

-- CreateIndex
CREATE INDEX "experiences_user_id_start_date_idx" ON "experiences"("user_id", "start_date" DESC);

-- CreateIndex
CREATE INDEX "achievements_user_id_type_idx" ON "achievements"("user_id", "type");

-- CreateIndex
CREATE INDEX "achievements_user_id_display_order_idx" ON "achievements"("user_id", "display_order");

-- CreateIndex
CREATE INDEX "educations_user_id_display_order_idx" ON "educations"("user_id", "display_order");

-- CreateIndex
CREATE INDEX "educations_user_id_start_date_idx" ON "educations"("user_id", "start_date" DESC);

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_tech_stacks" ADD CONSTRAINT "profile_tech_stacks_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_tech_stacks" ADD CONSTRAINT "profile_tech_stacks_tech_id_fkey" FOREIGN KEY ("tech_id") REFERENCES "tech_stacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "github_stats" ADD CONSTRAINT "github_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
