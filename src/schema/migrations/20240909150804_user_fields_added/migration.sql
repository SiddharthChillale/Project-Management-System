/*
  Warnings:

  - The `profilePic` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
DROP COLUMN "profilePic",
ADD COLUMN     "profilePic" JSONB,
ALTER COLUMN "userName" DROP NOT NULL;
