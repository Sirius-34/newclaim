/*
  Warnings:

  - Made the column `userGroupID` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userGroupID_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userGroupID" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userGroupID_fkey" FOREIGN KEY ("userGroupID") REFERENCES "sprUserGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
