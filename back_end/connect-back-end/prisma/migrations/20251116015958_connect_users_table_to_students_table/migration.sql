/*
  Warnings:

  - A unique constraint covering the columns `[usersClerkUserId]` on the table `Students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "usersClerkUserId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Students_usersClerkUserId_key" ON "Students"("usersClerkUserId");

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_usersClerkUserId_fkey" FOREIGN KEY ("usersClerkUserId") REFERENCES "Users"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
