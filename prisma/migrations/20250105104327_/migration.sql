/*
  Warnings:

  - You are about to drop the column `service_page` on the `Collaborations` table. All the data in the column will be lost.
  - You are about to drop the `ContestWinning` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Collaborations" DROP COLUMN "service_page";

-- DropTable
DROP TABLE "ContestWinning";

-- CreateTable
CREATE TABLE "Contest_Winning" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "picture" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Contest_Winning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page_Contest_Winning" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "contest_winning_id" INTEGER NOT NULL,

    CONSTRAINT "Page_Contest_Winning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_collaborations" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "collaboration_id" INTEGER NOT NULL,

    CONSTRAINT "page_collaborations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContestWinningToPage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CollaborationToPage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContestWinningToPage_AB_unique" ON "_ContestWinningToPage"("A", "B");

-- CreateIndex
CREATE INDEX "_ContestWinningToPage_B_index" ON "_ContestWinningToPage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollaborationToPage_AB_unique" ON "_CollaborationToPage"("A", "B");

-- CreateIndex
CREATE INDEX "_CollaborationToPage_B_index" ON "_CollaborationToPage"("B");

-- AddForeignKey
ALTER TABLE "Page_Contest_Winning" ADD CONSTRAINT "Page_Contest_Winning_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page_Contest_Winning" ADD CONSTRAINT "Page_Contest_Winning_contest_winning_id_fkey" FOREIGN KEY ("contest_winning_id") REFERENCES "Contest_Winning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_collaborations" ADD CONSTRAINT "page_collaborations_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_collaborations" ADD CONSTRAINT "page_collaborations_collaboration_id_fkey" FOREIGN KEY ("collaboration_id") REFERENCES "Collaborations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestWinningToPage" ADD CONSTRAINT "_ContestWinningToPage_A_fkey" FOREIGN KEY ("A") REFERENCES "Contest_Winning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContestWinningToPage" ADD CONSTRAINT "_ContestWinningToPage_B_fkey" FOREIGN KEY ("B") REFERENCES "Pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaborationToPage" ADD CONSTRAINT "_CollaborationToPage_A_fkey" FOREIGN KEY ("A") REFERENCES "Collaborations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollaborationToPage" ADD CONSTRAINT "_CollaborationToPage_B_fkey" FOREIGN KEY ("B") REFERENCES "Pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
