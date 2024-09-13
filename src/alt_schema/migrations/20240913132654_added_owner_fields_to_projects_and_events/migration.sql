/*
  Warnings:

  - You are about to drop the `_EventToUserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventToUserProfile" DROP CONSTRAINT "_EventToUserProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToUserProfile" DROP CONSTRAINT "_EventToUserProfile_B_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "creatorProfileId" INTEGER;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "creatorProfileId" INTEGER;

-- DropTable
DROP TABLE "_EventToUserProfile";

-- CreateTable
CREATE TABLE "_participants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_participants_AB_unique" ON "_participants"("A", "B");

-- CreateIndex
CREATE INDEX "_participants_B_index" ON "_participants"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participants" ADD CONSTRAINT "_participants_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_participants" ADD CONSTRAINT "_participants_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
