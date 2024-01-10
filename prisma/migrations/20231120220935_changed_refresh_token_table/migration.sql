/*
  Warnings:

  - The primary key for the `refresh_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `refresh_token` table. All the data in the column will be lost.
  - You are about to drop the column `rt_hash` on the `refresh_token` table. All the data in the column will be lost.
  - Added the required column `token` to the `refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_pkey",
DROP COLUMN "id",
DROP COLUMN "rt_hash",
ADD COLUMN     "token" TEXT NOT NULL;
