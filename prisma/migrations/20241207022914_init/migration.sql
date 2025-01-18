-- CreateEnum
CREATE TYPE "contactSubject" AS ENUM ('CONTACT_US', 'QUOTE_REQUEST', 'PHOTO_SESSION_BOOKING', 'COLLABORATION_PROPOSAL', 'INFORMATION_REQUEST', 'SERVICE_INQUIRY', 'RESERVATION_MODIFICATION_OR_CANCELLATION', 'APPOINTMENT_REQUEST', 'PARTNERSHIP_PROPOSAL', 'COMPLAINT_OR_TECHNICAL_ISSUE', 'PHOTO_USAGE_REQUEST', 'OTHER');

-- CreateEnum
CREATE TYPE "locale" AS ENUM ('ar', 'en', 'es', 'fr');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "servicePage" AS ENUM ('DEFAULT', 'MARRIAGE', 'PORTRAIT', 'EVENT', 'ENTERPRISE', 'PREGNANCY');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "webp" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "tumblr" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Galleries" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "profile_picture" TEXT,
    "tumblr_profile_picture" TEXT,
    "is_vital" BOOLEAN NOT NULL DEFAULT false,
    "background_color" TEXT,
    "background_opacity" TEXT,
    "service" "servicePage" DEFAULT 'DEFAULT',
    "private" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "galleryImageId" INTEGER,

    CONSTRAINT "Galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "role"[] DEFAULT ARRAY['USER']::"role"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "threadId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
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
    "refresh_token_expires_in" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ads" (
    "id" SERIAL NOT NULL,
    "src" VARCHAR(255) NOT NULL,
    "href" VARCHAR(255) NOT NULL,
    "alt" VARCHAR(255),
    "on_slider" BOOLEAN NOT NULL DEFAULT true,
    "on_aside" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collaborations" (
    "id" SERIAL NOT NULL,
    "picture" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "service_page" "servicePage"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Collaborations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestWinning" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "picture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ContestWinning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" SERIAL NOT NULL,
    "image_id" INTEGER NOT NULL,
    "gallery_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_users" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "gallery_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gallery_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "ip" TEXT,
    "cookie" TEXT,
    "user_agent" TEXT,
    "x_app_version" TEXT,
    "screen_width" INTEGER,
    "screen_height" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Threads" (
    "id" SERIAL NOT NULL,
    "participant_role" "role"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "subject" "contactSubject" DEFAULT 'CONTACT_US',
    "body" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_role" "role",
    "thread_id" INTEGER NOT NULL,
    "read_at" TIMESTAMP(3),
    "from_contact_form" BOOLEAN NOT NULL DEFAULT false,
    "ip" TEXT,
    "cookie" TEXT,
    "user_agent" TEXT,
    "x_app_version" TEXT,
    "screen_width" INTEGER,
    "screen_height" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "profile_picture" TEXT,
    "author" TEXT,
    "service_quality" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "professionalism" INTEGER NOT NULL,
    "valueForMoney" INTEGER NOT NULL,
    "flexibility" INTEGER NOT NULL,
    "rank" DOUBLE PRECISION NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "response" TEXT,
    "user_id" TEXT,
    "is_ghast" BOOLEAN NOT NULL DEFAULT false,
    "ip" TEXT,
    "cookie" TEXT,
    "user_agent" TEXT,
    "x_app_version" TEXT,
    "screen_width" INTEGER,
    "screen_height" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "_GalleryToImage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GalleryToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "Galleries_slug_key" ON "Galleries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Ads_src_key" ON "Ads"("src");

-- CreateIndex
CREATE UNIQUE INDEX "Ads_href_key" ON "Ads"("href");

-- CreateIndex
CREATE UNIQUE INDEX "Ads_alt_key" ON "Ads"("alt");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_GalleryToImage_AB_unique" ON "_GalleryToImage"("A", "B");

-- CreateIndex
CREATE INDEX "_GalleryToImage_B_index" ON "_GalleryToImage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GalleryToUser_AB_unique" ON "_GalleryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GalleryToUser_B_index" ON "_GalleryToUser"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Galleries" ADD CONSTRAINT "Galleries_galleryImageId_fkey" FOREIGN KEY ("galleryImageId") REFERENCES "gallery_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Threads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_users" ADD CONSTRAINT "gallery_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_users" ADD CONSTRAINT "gallery_users_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "Galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GalleryToImage" ADD CONSTRAINT "_GalleryToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "Galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GalleryToImage" ADD CONSTRAINT "_GalleryToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GalleryToUser" ADD CONSTRAINT "_GalleryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GalleryToUser" ADD CONSTRAINT "_GalleryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
