/*
  Warnings:

  - You are about to drop the `verify_email_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenAssignment" AS ENUM ('VERIFICATION', 'RESETTING');

-- DropTable
DROP TABLE "verify_email_tokens";

-- CreateTable
CREATE TABLE "email_tokens" (
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token_assignment" "TokenAssignment" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_tokens_pkey" PRIMARY KEY ("token")
);
