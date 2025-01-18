/*
  Warnings:

  - You are about to drop the column `background_color` on the `Galleries` table. All the data in the column will be lost.
  - You are about to drop the column `background_opacity` on the `Galleries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Galleries" DROP COLUMN "background_color",
DROP COLUMN "background_opacity";

-- AlterTable
ALTER TABLE "Pages" ADD COLUMN     "background_color" TEXT,
ADD COLUMN     "background_opacity" TEXT;
