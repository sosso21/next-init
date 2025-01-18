/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Pages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pages" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pages_slug_key" ON "Pages"("slug");
