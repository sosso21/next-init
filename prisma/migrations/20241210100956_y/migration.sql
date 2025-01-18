-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_thread_id_fkey";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
