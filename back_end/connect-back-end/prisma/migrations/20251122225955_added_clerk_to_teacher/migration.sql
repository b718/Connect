/*
  Warnings:

  - A unique constraint covering the columns `[usersClerkUserId]` on the table `Teachers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usersClerkUserId` to the `Teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teachers" ADD COLUMN     "usersClerkUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Teachers_usersClerkUserId_key" ON "Teachers"("usersClerkUserId");

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_usersClerkUserId_fkey" FOREIGN KEY ("usersClerkUserId") REFERENCES "Users"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
