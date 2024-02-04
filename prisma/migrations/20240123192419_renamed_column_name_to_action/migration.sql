/*
 Warnings:
 
 - You are about to drop the column `name` on the `permissions` table. All the data in the column will be lost.
 - Added the required column `action` to the `permissions` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "permissions"
  RENAME COLUMN "name" TO "action";