/*
  Warnings:

  - You are about to drop the `Chats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_userId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_userId_fkey";

-- DropTable
DROP TABLE "Chats";

-- DropTable
DROP TABLE "Response";

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "response" (
    "id" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response" ADD CONSTRAINT "response_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "response" ADD CONSTRAINT "response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
