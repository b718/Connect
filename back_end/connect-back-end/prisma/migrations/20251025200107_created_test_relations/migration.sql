-- CreateTable
CREATE TABLE "Tests" (
    "testId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "classesTableId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tests_pkey" PRIMARY KEY ("testId")
);

-- CreateTable
CREATE TABLE "StudentTestResults" (
    "studentTestResultId" TEXT NOT NULL,
    "testsTestId" TEXT NOT NULL,
    "studentsStudentId" TEXT NOT NULL,
    "testGrade" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentTestResults_pkey" PRIMARY KEY ("studentTestResultId")
);

-- AddForeignKey
ALTER TABLE "Tests" ADD CONSTRAINT "Tests_classesTableId_fkey" FOREIGN KEY ("classesTableId") REFERENCES "Classes"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTestResults" ADD CONSTRAINT "StudentTestResults_testsTestId_fkey" FOREIGN KEY ("testsTestId") REFERENCES "Tests"("testId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTestResults" ADD CONSTRAINT "StudentTestResults_studentsStudentId_fkey" FOREIGN KEY ("studentsStudentId") REFERENCES "Students"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
