/*
  Warnings:

  - You are about to drop the column `pageId` on the `Collaborations` table. All the data in the column will be lost.
  - Made the column `picture` on table `Collaborations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Collaborations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Contest_Winning` required. This step will fail if there are existing NULL values in that column.
  - Made the column `picture` on table `Contest_Winning` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Collaborations" DROP CONSTRAINT "Collaborations_pageId_fkey";

-- AlterTable
ALTER TABLE "Collaborations" DROP COLUMN "pageId",
ADD COLUMN     "blur_picture" TEXT,
ALTER COLUMN "picture" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Contest_Winning" ADD COLUMN     "blur_picture" TEXT,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "picture" SET NOT NULL;

-- CreateTable
CREATE TABLE "_CollaborationToPage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollaborationToPage_AB_unique" ON "_CollaborationToPage"("A", "B");

-- CreateIndex
CREATE INDEX "_CollaborationToPage_B_index" ON "_CollaborationToPage"("B");

-- AddForeignKey
ALTER TABLE "_CollaborationToPage" ADD CONSTRAINT "_CollaborationToPage_A_fkey" FOREIGN KEY ("A") REFERENCES "Collaborations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaborationToPage" ADD CONSTRAINT "_CollaborationToPage_B_fkey" FOREIGN KEY ("B") REFERENCES "Pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
