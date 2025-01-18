/*
  Warnings:

  - You are about to drop the `_GalleryToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GalleryToUser" DROP CONSTRAINT "_GalleryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GalleryToUser" DROP CONSTRAINT "_GalleryToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "galleryId" INTEGER;

-- DropTable
DROP TABLE "_GalleryToUser";

-- CreateTable
CREATE TABLE "Phone" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Galleries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
