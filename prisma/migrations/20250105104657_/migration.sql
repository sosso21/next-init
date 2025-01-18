/*
  Warnings:

  - You are about to drop the `_CollaborationToPage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CollaborationToPage" DROP CONSTRAINT "_CollaborationToPage_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollaborationToPage" DROP CONSTRAINT "_CollaborationToPage_B_fkey";

-- AlterTable
ALTER TABLE "Collaborations" ADD COLUMN     "pageId" INTEGER,
ALTER COLUMN "picture" DROP NOT NULL;

-- DropTable
DROP TABLE "_CollaborationToPage";

-- AddForeignKey
ALTER TABLE "Collaborations" ADD CONSTRAINT "Collaborations_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
