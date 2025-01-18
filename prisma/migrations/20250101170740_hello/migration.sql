/*
  Warnings:

  - You are about to drop the column `service` on the `Galleries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Galleries" DROP COLUMN "service",
ADD COLUMN     "category" "servicePage" DEFAULT 'DEFAULT';

-- CreateTable
CREATE TABLE "Pages" (
    "id" SERIAL NOT NULL,
    "background_picture" VARCHAR(255) NOT NULL,
    "category" "servicePage" NOT NULL DEFAULT 'DEFAULT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pages_category_key" ON "Pages"("category");
