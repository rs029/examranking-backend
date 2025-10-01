/*
  Warnings:

  - Added the required column `marksCorrect` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marksUnattempted` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marksWrong` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Exam" ADD COLUMN     "marksCorrect" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "marksUnattempted" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "marksWrong" DOUBLE PRECISION NOT NULL;
