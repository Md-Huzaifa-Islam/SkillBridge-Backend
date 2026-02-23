/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `tutorprofiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `tutorprofiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutorprofiles" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tutorprofiles_userId_key" ON "tutorprofiles"("userId");

-- AddForeignKey
ALTER TABLE "tutorprofiles" ADD CONSTRAINT "tutorprofiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
