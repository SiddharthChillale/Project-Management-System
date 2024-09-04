/*
  Warnings:

  - You are about to drop the column `team_size` on the `Projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "team_size",
ADD COLUMN     "teamSize" INTEGER;
