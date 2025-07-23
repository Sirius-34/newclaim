-- CreateEnum
CREATE TYPE "UserPermission" AS ENUM ('EDITOR', 'BLOCK_CLAIMS', 'ALL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permissions" "UserPermission"[],
    "userGroupID" TEXT,
    "cAct" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "serialNumber" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documents" TEXT[],
    "authorId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blockedAt" TIMESTAMP(3),

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprUserGroup" (
    "id" TEXT NOT NULL,
    "npp" SERIAL NOT NULL,
    "cUserGroupName" TEXT NOT NULL,

    CONSTRAINT "sprUserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_key" ON "User"("nick");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_serialNumber_key" ON "Claim"("serialNumber");

-- CreateIndex
CREATE INDEX "Claim_authorId_idx" ON "Claim"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "sprUserGroup_npp_key" ON "sprUserGroup"("npp");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userGroupID_fkey" FOREIGN KEY ("userGroupID") REFERENCES "sprUserGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
