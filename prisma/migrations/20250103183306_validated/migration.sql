-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "is_accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "validated_by_admin" BOOLEAN NOT NULL DEFAULT false;
