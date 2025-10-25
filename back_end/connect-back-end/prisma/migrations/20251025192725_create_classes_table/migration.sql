-- CreateTable
CREATE TABLE "Classes" (
    "classId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "studentGradeYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classes_pkey" PRIMARY KEY ("classId")
);
