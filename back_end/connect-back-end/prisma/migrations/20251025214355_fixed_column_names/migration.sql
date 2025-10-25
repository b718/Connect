/*
  Warnings:

  - You are about to drop the column `studentsStudentId` on the `StudentTestResults` table. All the data in the column will be lost.
  - You are about to drop the column `testsTestId` on the `StudentTestResults` table. All the data in the column will be lost.
  - Added the required column `studentsTableId` to the `StudentTestResults` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testsTableId` to the `StudentTestResults` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StudentTestResults" DROP CONSTRAINT "StudentTestResults_studentsStudentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentTestResults" DROP CONSTRAINT "StudentTestResults_testsTestId_fkey";

-- AlterTable
ALTER TABLE "StudentTestResults" DROP COLUMN "studentsStudentId",
DROP COLUMN "testsTestId",
ADD COLUMN     "studentsTableId" TEXT NOT NULL,
ADD COLUMN     "testsTableId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentTestResults" ADD CONSTRAINT "StudentTestResults_testsTableId_fkey" FOREIGN KEY ("testsTableId") REFERENCES "Tests"("testId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTestResults" ADD CONSTRAINT "StudentTestResults_studentsTableId_fkey" FOREIGN KEY ("studentsTableId") REFERENCES "Students"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
