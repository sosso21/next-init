/*
  Warnings:

  - You are about to drop the column `galleryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phones` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Phone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Phone" DROP CONSTRAINT "Phone_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_galleryId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "galleryId",
DROP COLUMN "phones";

-- DropTable
DROP TABLE "Phone";

-- CreateTable
CREATE TABLE "_GalleryToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GalleryToUser_AB_unique" ON "_GalleryToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GalleryToUser_B_index" ON "_GalleryToUser"("B");

-- AddForeignKey
ALTER TABLE "_GalleryToUser" ADD CONSTRAINT "_GalleryToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GalleryToUser" ADD CONSTRAINT "_GalleryToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
