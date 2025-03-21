/*
  Warnings:

  - You are about to drop the column `error` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "error",
DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
