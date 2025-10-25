/*
  Warnings:

  - You are about to drop the column `classesTableId` on the `Students` table. All the data in the column will be lost.
  - You are about to drop the column `classesTableId` on the `Teachers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Students" DROP CONSTRAINT "Students_classesTableId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Teachers" DROP CONSTRAINT "Teachers_classesTableId_fkey";

-- AlterTable
ALTER TABLE "Students" DROP COLUMN "classesTableId";

-- AlterTable
ALTER TABLE "Teachers" DROP COLUMN "classesTableId";

-- CreateTable
CREATE TABLE "_ClassesToStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassesToStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClassesToTeachers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassesToTeachers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClassesToStudents_B_index" ON "_ClassesToStudents"("B");

-- CreateIndex
CREATE INDEX "_ClassesToTeachers_B_index" ON "_ClassesToTeachers"("B");

-- AddForeignKey
ALTER TABLE "_ClassesToStudents" ADD CONSTRAINT "_ClassesToStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Classes"("classId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassesToStudents" ADD CONSTRAINT "_ClassesToStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Students"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassesToTeachers" ADD CONSTRAINT "_ClassesToTeachers_A_fkey" FOREIGN KEY ("A") REFERENCES "Classes"("classId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassesToTeachers" ADD CONSTRAINT "_ClassesToTeachers_B_fkey" FOREIGN KEY ("B") REFERENCES "Teachers"("teacherId") ON DELETE CASCADE ON UPDATE CASCADE;
