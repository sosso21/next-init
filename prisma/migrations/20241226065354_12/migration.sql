/*
  Warnings:

  - You are about to drop the `Phone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Phone" DROP CONSTRAINT "Phone_user_id_fkey";

-- DropTable
DROP TABLE "Phone";
