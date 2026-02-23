/*
  Warnings:

  - You are about to drop the column `studentId` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_studentId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "studentId";
