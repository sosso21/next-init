/*
  Warnings:

  - You are about to drop the column `background_picture` on the `Pages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pages" DROP COLUMN "background_picture",
ADD COLUMN     "background_image_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Pages" ADD CONSTRAINT "Pages_background_image_id_fkey" FOREIGN KEY ("background_image_id") REFERENCES "Images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
