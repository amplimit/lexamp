/*
  Warnings:

  - You are about to drop the column `emailNotifications` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `profileVisibility` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `systemNotifications` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "emailNotifications",
DROP COLUMN "profileVisibility",
DROP COLUMN "systemNotifications",
ADD COLUMN     "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "fontSize" TEXT NOT NULL DEFAULT 'normal',
ADD COLUMN     "marketingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "messagesEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "theme" SET DEFAULT 'system';
