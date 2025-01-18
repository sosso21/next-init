/*
  Warnings:

  - You are about to drop the column `threadId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Collaborations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contest_Winning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Galleries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Page_Contest_Winning` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Threads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollaborationToPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContestWinningToPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GalleryToImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GalleryToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gallery_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gallery_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `page_collaborations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Galleries" DROP CONSTRAINT "Galleries_galleryImageId_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_thread_id_fkey";

-- DropForeignKey
ALTER TABLE "Page_Contest_Winning" DROP CONSTRAINT "Page_Contest_Winning_contest_winning_id_fkey";

-- DropForeignKey
ALTER TABLE "Page_Contest_Winning" DROP CONSTRAINT "Page_Contest_Winning_page_id_fkey";

-- DropForeignKey
ALTER TABLE "Pages" DROP CONSTRAINT "Pages_background_image_id_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_threadId_fkey";

-- DropForeignKey
ALTER TABLE "_CollaborationToPage" DROP CONSTRAINT "_CollaborationToPage_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollaborationToPage" DROP CONSTRAINT "_CollaborationToPage_B_fkey";

-- DropForeignKey
ALTER TABLE "_ContestWinningToPage" DROP CONSTRAINT "_ContestWinningToPage_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContestWinningToPage" DROP CONSTRAINT "_ContestWinningToPage_B_fkey";

-- DropForeignKey
ALTER TABLE "_GalleryToImage" DROP CONSTRAINT "_GalleryToImage_A_fkey";

-- DropForeignKey
ALTER TABLE "_GalleryToImage" DROP CONSTRAINT "_GalleryToImage_B_fkey";

-- DropForeignKey
ALTER TABLE "_GalleryToUser" DROP CONSTRAINT "_GalleryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GalleryToUser" DROP CONSTRAINT "_GalleryToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "gallery_images" DROP CONSTRAINT "gallery_images_image_id_fkey";

-- DropForeignKey
ALTER TABLE "gallery_users" DROP CONSTRAINT "gallery_users_gallery_id_fkey";

-- DropForeignKey
ALTER TABLE "gallery_users" DROP CONSTRAINT "gallery_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "page_collaborations" DROP CONSTRAINT "page_collaborations_collaboration_id_fkey";

-- DropForeignKey
ALTER TABLE "page_collaborations" DROP CONSTRAINT "page_collaborations_page_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "threadId";

-- DropTable
DROP TABLE "Collaborations";

-- DropTable
DROP TABLE "Contest_Winning";

-- DropTable
DROP TABLE "Galleries";

-- DropTable
DROP TABLE "Images";

-- DropTable
DROP TABLE "Messages";

-- DropTable
DROP TABLE "Page_Contest_Winning";

-- DropTable
DROP TABLE "Pages";

-- DropTable
DROP TABLE "Reviews";

-- DropTable
DROP TABLE "Threads";

-- DropTable
DROP TABLE "_CollaborationToPage";

-- DropTable
DROP TABLE "_ContestWinningToPage";

-- DropTable
DROP TABLE "_GalleryToImage";

-- DropTable
DROP TABLE "_GalleryToUser";

-- DropTable
DROP TABLE "gallery_images";

-- DropTable
DROP TABLE "gallery_users";

-- DropTable
DROP TABLE "page_collaborations";

-- DropEnum
DROP TYPE "contactSubject";

-- DropEnum
DROP TYPE "servicePage";
