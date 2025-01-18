-- CreateTable
CREATE TABLE "Phone" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
