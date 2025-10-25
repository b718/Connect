/*
  Warnings:

  - Added the required column `classesTableId` to the `Students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classesTableId` to the `Teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Students" ADD COLUMN     "classesTableId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teachers" ADD COLUMN     "classesTableId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Teachers" ADD CONSTRAINT "Teachers_classesTableId_fkey" FOREIGN KEY ("classesTableId") REFERENCES "Classes"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Students" ADD CONSTRAINT "Students_classesTableId_fkey" FOREIGN KEY ("classesTableId") REFERENCES "Classes"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;
