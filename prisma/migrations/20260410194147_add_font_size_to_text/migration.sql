/*
  Warnings:

  - Added the required column `fontSize` to the `TextItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TextItem" ADD COLUMN     "fontSize" TEXT NOT NULL;
