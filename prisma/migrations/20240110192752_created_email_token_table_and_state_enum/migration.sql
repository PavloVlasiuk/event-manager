-- CreateEnum
CREATE TYPE "State" AS ENUM ('APPROVED', 'PENDING', 'DECLINED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "state" "State" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "verify_email_tokens" (
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verify_email_tokens_pkey" PRIMARY KEY ("token")
);
