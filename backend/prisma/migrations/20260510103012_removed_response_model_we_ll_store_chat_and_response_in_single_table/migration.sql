/*
  Warnings:

  - You are about to drop the `response` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `responses` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "response" DROP CONSTRAINT "response_chatId_fkey";

-- DropForeignKey
ALTER TABLE "response" DROP CONSTRAINT "response_userId_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "responses" TEXT NOT NULL;

-- DropTable
DROP TABLE "response";
