/*
  Warnings:

  - A unique constraint covering the columns `[testName,classesTableId]` on the table `Tests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tests_testName_classesTableId_key" ON "Tests"("testName", "classesTableId");
