/*
  Warnings:

  - Added the required column `createdAt` to the `catalog_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `catalog_items` ADD COLUMN `createdAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;
