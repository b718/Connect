/*
  Warnings:

  - A unique constraint covering the columns `[testsTableId,studentsTableId]` on the table `StudentTestResults` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentTestResults_testsTableId_studentsTableId_key" ON "StudentTestResults"("testsTableId", "studentsTableId");
