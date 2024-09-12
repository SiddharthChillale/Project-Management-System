/*
  Warnings:

  - Added the required column `updateAt` to the `ProjectAssociation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PUBLIC';

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Ratings" DROP CONSTRAINT "Ratings_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Ratings" DROP CONSTRAINT "Ratings_scoreCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropIndex
DROP INDEX "ScoreCategory_name_key";

-- DropIndex
DROP INDEX "UserProfile_userName_key";

-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "name" SET DEFAULT 'deleted';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "isArchived" SET DEFAULT false;

-- AlterTable
ALTER TABLE "ProjectAssociation" ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ScoreCategory" ALTER COLUMN "name" SET DEFAULT 'unkown';

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_scoreCategoryId_fkey" FOREIGN KEY ("scoreCategoryId") REFERENCES "ScoreCategory"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
