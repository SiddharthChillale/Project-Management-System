/*
  Warnings:

  - Changed the type of `status` on the `ProjectAssociation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IS_FINAL', 'IS_WAITLIST', 'IS_ENROLL');

-- AlterTable
ALTER TABLE "ProjectAssociation" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- DropEnum
DROP TYPE "status";

-- CreateTable
CREATE TABLE "ScoreCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ScoreCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ratings" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "scoreCategoryId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userProfileId" INTEGER NOT NULL,

    CONSTRAINT "Ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToUserProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseToUserProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ScoreCategory_name_key" ON "ScoreCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToUserProfile_AB_unique" ON "_EventToUserProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToUserProfile_B_index" ON "_EventToUserProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToUserProfile_AB_unique" ON "_CourseToUserProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToUserProfile_B_index" ON "_CourseToUserProfile"("B");

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_scoreCategoryId_fkey" FOREIGN KEY ("scoreCategoryId") REFERENCES "ScoreCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUserProfile" ADD CONSTRAINT "_EventToUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUserProfile" ADD CONSTRAINT "_EventToUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToUserProfile" ADD CONSTRAINT "_CourseToUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToUserProfile" ADD CONSTRAINT "_CourseToUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
